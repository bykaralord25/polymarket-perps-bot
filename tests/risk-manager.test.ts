import assert from "node:assert/strict";
import { RiskManager } from "../src/risk/risk-manager.js";

const risk = new RiskManager(0.01, 2, 0.01, 0.02, 0.03);
const levels = risk.levels("long", 100);
assert.equal(levels.stopLoss, 99);
assert.equal(levels.takeProfit, 102);
assert.ok(risk.quantity(10_000, 100, 99) > 0);
assert.equal(risk.canTrade(10_000, 9_800), true);
assert.equal(risk.canTrade(10_000, 9_600), false);

console.log("risk tests passed");
