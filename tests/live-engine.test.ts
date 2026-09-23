import assert from "node:assert/strict";
import { LiveEngine } from "../src/trading/live-engine.js";
const locked = new LiveEngine();
await assert.rejects(() => locked.open({ side: "long", tick: { symbol: "BTC", price: 100, timestamp: 1 }, quantity: 1, stopLoss: 99, takeProfit: 102 }), /safety lock is active/);
await assert.rejects(() => locked.cancelAll(), /safety lock is active/);
const calls: string[] = [];
const fakeSession = {
  fetchBalances: async () => [],
  fetchPortfolio: async () => ({ positions: [] }),
  fetchOpenOrders: async () => [],
  fetchAutoCancelStatus: async () => ({ armed: false }),
  updateLeverage: async () => { calls.push("leverage"); return {}; },
  armAutoCancel: async () => { calls.push("arm"); },
  disarmAutoCancel: async () => { calls.push("disarm"); },
  placeOrder: async (request: unknown) => { calls.push("order"); return { order: request }; },
  cancelAllOrders: async () => { calls.push("cancel"); },
  close: async () => { calls.push("close"); }
};
const enabled = new LiveEngine(fakeSession as never, { enabled: true, instrumentId: 1, leverage: 2, autoCancelMs: 60_000 });
await enabled.configureRisk(); await enabled.armDeadManSwitch(); await enabled.accountSnapshot();
await enabled.open({ side: "long", tick: { symbol: "BTC", price: 100, timestamp: 1 }, quantity: 1, stopLoss: 99, takeProfit: 102 });
await enabled.cancelAll(); await enabled.disarmDeadManSwitch(); await enabled.close();
assert.deepEqual(calls, ["leverage", "arm", "order", "cancel", "disarm", "close"]);
console.log("live engine tests passed");
