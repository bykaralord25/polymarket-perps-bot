import assert from "node:assert/strict";
import { retryDelay } from "../src/market/polymarket-feed.js";

assert.equal(retryDelay(0), 1_000);
assert.equal(retryDelay(1), 2_000);
assert.equal(retryDelay(2), 4_000);
assert.equal(retryDelay(3), 8_000);
assert.equal(retryDelay(4), 16_000);
assert.equal(retryDelay(5), 30_000);
assert.equal(retryDelay(20), 30_000);

console.log("market feed tests passed");
