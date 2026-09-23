import type { Tick } from "../types.js";

export async function* mockFeed(
  symbol: string,
  intervalMs: number,
  startPrice = 65_000
): AsyncGenerator<Tick> {
  let price = startPrice;
  while (true) {
    const drift = (Math.random() - 0.495) * 0.004;
    price = Math.max(1, price * (1 + drift));
    yield { symbol, price, timestamp: Date.now() };
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
}
