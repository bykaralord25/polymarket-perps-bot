import { createPublicClient } from "@polymarket/client";
import type { Tick } from "../types.js";

const client = createPublicClient();

function normalizeSymbol(value: string): string {
  return value.trim().toUpperCase().replace(/[-_/](USD|USDC|USDT|PERP)$/i, "");
}

export async function* polymarketFeed(
  requestedSymbol: string,
  intervalMs: number
): AsyncGenerator<Tick> {
  const instruments = await client.fetchPerpsInstruments();
  const wanted = normalizeSymbol(requestedSymbol);
  const instrument = instruments.find((item) => {
    const candidates = [item.symbol, String(item.baseAsset)];
    return candidates.some((candidate) => normalizeSymbol(candidate) === wanted);
  });

  if (!instrument) {
    const available = instruments.slice(0, 20).map((item) => item.symbol).join(", ");
    throw new Error(
      `Perps instrument "${requestedSymbol}" was not found. Available examples: ${available}`
    );
  }

  console.log(
    `Polymarket market feed connected: ${instrument.symbol} (instrument ${instrument.id})`
  );

  while (true) {
    const ticker = await client.fetchPerpsTicker({ instrumentId: instrument.id });
    const price = Number(ticker.markPrice || ticker.midPrice || ticker.lastPrice);
    if (!Number.isFinite(price) || price <= 0) {
      throw new Error(`Invalid ticker price received for ${instrument.symbol}`);
    }

    yield {
      symbol: instrument.symbol,
      price,
      timestamp: ticker.timestamp ?? Date.now()
    };

    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
}
