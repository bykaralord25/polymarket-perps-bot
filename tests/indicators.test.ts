import assert from "node:assert/strict";
import { ema, rsi } from "../src/strategy/indicators.js";

assert.equal(ema([1, 2, 3], 5), null);
assert.equal(rsi(Array.from({ length: 16 }, (_, i) => i + 1), 14), 100);

const emaValue = ema([1, 2, 3, 4, 5], 3);
assert.ok(emaValue !== null && emaValue > 3);

console.log("indicator tests passed");
