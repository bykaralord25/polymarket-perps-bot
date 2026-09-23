import { config } from "./config.js";
import { mockFeed } from "./market/mock-feed.js";
import { polymarketFeed } from "./market/polymarket-feed.js";
import { RiskManager } from "./risk/risk-manager.js";
import { SignalEngine } from "./strategy/signal-engine.js";
import { PaperEngine } from "./trading/paper-engine.js";

const risk = new RiskManager(
  config.RISK_PER_TRADE,
  config.MAX_LEVERAGE,
  config.STOP_LOSS_PCT,
  config.TAKE_PROFIT_PCT,
  config.DAILY_LOSS_LIMIT_PCT
);
const signals = new SignalEngine();
const paper = new PaperEngine(config.STARTING_BALANCE, risk);

console.log("Polymarket Perps Bot v0.4.0");
console.log(`mode=${config.TRADING_MODE} source=${config.MARKET_SOURCE} symbol=${config.SYMBOL} balance=$${config.STARTING_BALANCE.toFixed(2)}`);
console.log("Execution is paper-only. No real orders can be sent.\n");

const feed =
  config.MARKET_SOURCE === "polymarket"
    ? polymarketFeed(config.SYMBOL, config.TICK_INTERVAL_MS)
    : mockFeed(config.SYMBOL, config.TICK_INTERVAL_MS);

try {
  for await (const tick of feed) {
    await paper.onTick(tick);
    const result = signals.update(tick.price);

    if (result.signal !== "hold") {
      await paper.flipIfNeeded(result.signal, tick);
    }

    const { balance, position } = paper.state;
    const rsiText = result.rsi === null ? "--" : result.rsi.toFixed(1);
    const positionText = position
      ? `${position.side.toUpperCase()} ${position.quantity.toFixed(5)}`
      : "FLAT";

    console.log(
      `${new Date(tick.timestamp).toISOString()} ${tick.symbol} $${tick.price.toFixed(2)} RSI=${rsiText} signal=${result.signal.toUpperCase()} position=${positionText} balance=$${balance.toFixed(2)}`
    );
  }
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  const cause =
    error instanceof Error && "cause" in error
      ? String((error as Error & { cause?: unknown }).cause ?? "")
      : "";
  const details = `${message} ${cause}`;

  console.error("\nMarket data connection failed.");

  if (/SELF_SIGNED_CERT|UNTRUSTED_ROOT|certificate/i.test(details)) {
    console.error("TLS certificate verification failed. Do not disable TLS verification.");
    console.error("If your operating system trusts a local CA, try: npm run dev:system-ca");
  } else if (/timed out|timeout|ETIMEDOUT|AbortController/i.test(details)) {
    console.error("The Polymarket API request timed out. Check whether the service is reachable from your network/region.");
  } else {
    console.error(message);
  }

  console.error("No real order was sent.");
  process.exitCode = 1;
}
