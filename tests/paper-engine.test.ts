import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chdir, cwd } from "node:process";
import { RiskManager } from "../src/risk/risk-manager.js";
import { PaperEngine } from "../src/trading/paper-engine.js";
import type { Tick } from "../src/types.js";

const originalCwd = cwd();
const temp = await mkdtemp(join(tmpdir(), "perps-paper-test-"));
chdir(temp);

const tick = (price: number, timestamp: number): Tick => ({ symbol: "BTC", price, timestamp });

try {
  {
    const risk = new RiskManager(0.01, 2, 0.01, 0.02, 0.03);
    const engine = new PaperEngine(10_000, risk);
    assert.equal(await engine.open("long", tick(100, 1)), true);
    assert.equal(engine.state.position?.side, "long");
    await engine.onTick(tick(102, 2));
    assert.equal(engine.state.position, null);
    assert.ok(engine.state.balance > 10_000, "long take-profit should increase balance");
  }

  {
    const risk = new RiskManager(0.01, 2, 0.01, 0.02, 0.03);
    const engine = new PaperEngine(10_000, risk);
    await engine.open("short", tick(100, 1));
    await engine.onTick(tick(98, 2));
    assert.equal(engine.state.position, null);
    assert.ok(engine.state.balance > 10_000, "short take-profit should increase balance");
  }

  {
    const risk = new RiskManager(0.01, 2, 0.01, 0.02, 0.03);
    const engine = new PaperEngine(10_000, risk);
    await engine.open("long", tick(100, 1));
    await engine.onTick(tick(99, 2));
    assert.equal(engine.state.position, null);
    assert.ok(engine.state.balance < 10_000, "long stop-loss should reduce balance");
  }

  {
    const risk = new RiskManager(0.01, 2, 0.01, 0.02, 0.03);
    const engine = new PaperEngine(10_000, risk);
    await engine.open("long", tick(100, 1));
    await engine.flipIfNeeded("short", tick(101, 2));
    assert.equal(engine.state.position?.side, "short");
    assert.ok(engine.state.balance > 10_000, "profitable flip should realize PnL");
  }

  console.log("paper engine tests passed");
} finally {
  chdir(originalCwd);
  await rm(temp, { recursive: true, force: true });
}
