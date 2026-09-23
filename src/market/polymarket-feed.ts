import { createPublicClient } from "@polymarket/client";
import type { Tick } from "../types.js";

const client = createPublicClient();

function normalizeSymbol(value: string): string {
  return value.trim().toUpperCase().replace(/[-_/](USD|USDC|USDT|PERP)$/i, "");
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

  console.log(
    `Polymarket WebSocket connected: ${instrument.symbol} (instrument ${instrument.id})`
  );

  const handle = await client.subscribe([
    { topic: "perps.tickers", instrumentId: instrument.id }
  ]);

  try {
    for await (const event of handle) {
      if (event.topic !== "perps.tickers" || event.type !== "ticker") continue;
      const price = Number(
        event.payload.markPrice || event.payload.midPrice || event.payload.lastPrice
      );
      if (!Number.isFinite(price) || price <= 0) continue;

      yield {
        symbol: instrument.symbol,
        price,
        timestamp: event.timestamp
      };
    }
  } finally {
    await handle.close();
  }
}
