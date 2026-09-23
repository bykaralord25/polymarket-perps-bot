import { ema, rsi } from "./indicators.js";
import type { Signal } from "../types.js";

export class SignalEngine {
  private prices: number[] = [];

  update(price: number): { signal: Signal; rsi: number | null; fast: number | null; slow: number | null } {
    this.prices.push(price);
    if (this.prices.length > 300) this.prices.shift();

    const fast = ema(this.prices, 9);
    const slow = ema(this.prices, 21);
    const momentum = rsi(this.prices, 14);

    if (fast === null || slow === null || momentum === null) {
      return { signal: "hold", rsi: momentum, fast, slow };
    }

    if (fast > slow && momentum >= 52 && momentum < 72) {
      return { signal: "long", rsi: momentum, fast, slow };
    }
    if (fast < slow && momentum <= 48 && momentum > 28) {
      return { signal: "short", rsi: momentum, fast, slow };
    }
    return { signal: "hold", rsi: momentum, fast, slow };
  }
}
