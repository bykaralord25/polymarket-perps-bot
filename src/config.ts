import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  TRADING_MODE: z.enum(["paper", "live"]).default("paper"),
  MARKET_SOURCE: z.enum(["polymarket", "mock"]).default("polymarket"),
  SYMBOL: z.string().min(1).default("BTC"),
  STARTING_BALANCE: z.coerce.number().positive().default(10_000),
  RISK_PER_TRADE: z.coerce.number().positive().max(0.1).default(0.01),
  MAX_LEVERAGE: z.coerce.number().positive().max(20).default(2),
  STOP_LOSS_PCT: z.coerce.number().positive().max(0.5).default(0.01),
  TAKE_PROFIT_PCT: z.coerce.number().positive().max(1).default(0.02),
  DAILY_LOSS_LIMIT_PCT: z.coerce.number().positive().max(0.5).default(0.03),
  TICK_INTERVAL_MS: z.coerce.number().int().min(250).default(1000)
});

export const config = schema.parse(process.env);

if (config.TRADING_MODE === "live") {
  throw new Error("Live trading is not enabled yet. Set TRADING_MODE=paper.");
}
