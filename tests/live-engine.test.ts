import assert from "node:assert/strict";
import { LiveEngine } from "../src/trading/live-engine.js";

const engine = new LiveEngine();

await assert.rejects(
  () =>
    engine.open({
      side: "long",
      tick: { symbol: "BTC", price: 100, timestamp: 1 },
      quantity: 1,
      stopLoss: 99,
      takeProfit: 102
    }),
  /safety lock is active/
);

await assert.rejects(() => engine.closeAll(), /safety lock is active/);

console.log("live safety-lock tests passed");
