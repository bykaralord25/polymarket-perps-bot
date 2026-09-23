import { createPublicClient } from "@polymarket/client";
import type { Tick } from "../types.js";

const client = createPublicClient();
const MAX_RECONNECT_DELAY_MS = 30_000;

function normalizeSymbol(value: string): string {
  return value.trim().toUpperCase().replace(/[-_/](USD|USDC|USDT|PERP)$/i, "");
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function retryDelay(attempt: number): number {
  return Math.min(1_000 * 2 ** Math.min(attempt, 5), MAX_RECONNECT_DELAY_MS);
}

export async function* polymarketFeed(
  requestedSymbol: string,
  _intervalMs: number
): AsyncGenerator<Tick> {
  const instruments = await client.fetchPerpsInstruments();
  const wanted = normalizeSymbol(requestedSymbol);
  const instrument = instruments.find((item) =>
    [item.symbol, String(item.baseAsset)].some(
      (candidate) => normalizeSymbol(candidate) === wanted
    )
  );

  if (!instrument) {
    const available = instruments.slice(0, 20).map((item) => item.symbol).join(", ");
    throw new Error(
      `Perps instrument "${requestedSymbol}" was not found. Available examples: ${available}`
    );
  }

  let attempt = 0;

  while (true) {
    let handle: Awaited<ReturnType<typeof client.subscribe>> | undefined;
    let receivedValidTick = false;

    try {
      handle = await client.subscribe([
        { topic: "perps.tickers", instrumentId: instrument.id }
      ]);

      console.log(
        `Polymarket WebSocket connected: ${instrument.symbol} (instrument ${instrument.id})`
      );

      for await (const event of handle) {
        if (event.topic !== "perps.tickers" || event.type !== "ticker") continue;

        const price = Number(
          event.payload.markPrice || event.payload.midPrice || event.payload.lastPrice
        );
        if (!Number.isFinite(price) || price <= 0) continue;

        receivedValidTick = true;
        attempt = 0;

        yield {
          symbol: instrument.symbol,
          price,
          timestamp: event.timestamp
        };
      }

      throw new Error("Polymarket WebSocket stream ended unexpectedly.");
    } catch (error) {
      const delay = retryDelay(attempt++);
      const message = error instanceof Error ? error.message : String(error);
      console.warn(
        `Polymarket WebSocket disconnected: ${message}. Reconnecting in ${Math.round(delay / 1000)}s...`
      );
      if (receivedValidTick) attempt = 1;
      await sleep(delay);
    } finally {
      if (handle) {
        try {
          await handle.close();
        } catch {
          // The connection is already gone; reconnect loop will create a new handle.
        }
      }
    }
  }
}
