import { OrderSide, PerpsTimeInForce, type PerpsSession } from "@polymarket/client";
import type { Side, Tick } from "../types.js";
export interface LiveOrderIntent { side: Side; tick: Tick; quantity: number; stopLoss: number; takeProfit: number; }
export interface LiveExecutionOptions { enabled: boolean; instrumentId: number; leverage: number; autoCancelMs?: number; }
export class LiveEngine {
  constructor(private readonly session: PerpsSession | null = null, private readonly options: LiveExecutionOptions = { enabled: false, instrumentId: 0, leverage: 1, autoCancelMs: 60_000 }) {}
  private ready(): PerpsSession {
    if (!this.options.enabled || !this.session) throw new Error("Live execution safety lock is active. No real order was sent.");
    if (!Number.isInteger(this.options.instrumentId) || this.options.instrumentId <= 0) throw new Error("A valid Perps instrumentId is required for live execution.");
    if (!Number.isFinite(this.options.leverage) || this.options.leverage <= 0) throw new Error("A valid positive leverage is required for live execution.");
    return this.session;
  }
  async accountSnapshot() {
    const session = this.ready();
    const [balances, portfolio, openOrders, autoCancel] = await Promise.all([session.fetchBalances(), session.fetchPortfolio(), session.fetchOpenOrders({ instrumentId: this.options.instrumentId }), session.fetchAutoCancelStatus()]);
    return { balances, portfolio, openOrders, autoCancel };
  }
  async configureRisk(): Promise<void> {
    await this.ready().updateLeverage({ crossMargin: true, instrumentId: this.options.instrumentId, leverage: this.options.leverage });
  }
  async armDeadManSwitch(): Promise<void> {
    const delay = Math.max(this.options.autoCancelMs ?? 60_000, 5_000);
    await this.ready().armAutoCancel({ cancelAt: Date.now() + delay });
  }
  async disarmDeadManSwitch(): Promise<void> { await this.ready().disarmAutoCancel(); }
  async open(intent: LiveOrderIntent) {
    const session = this.ready();
    if (!Number.isFinite(intent.quantity) || intent.quantity <= 0) throw new Error("Live order quantity must be positive.");
    if (!Number.isFinite(intent.stopLoss) || intent.stopLoss <= 0 || !Number.isFinite(intent.takeProfit) || intent.takeProfit <= 0) throw new Error("Live TP/SL prices must be positive.");
    return await session.placeOrder({ instrumentId: this.options.instrumentId, quantity: String(intent.quantity), side: intent.side === "long" ? OrderSide.BUY : OrderSide.SELL, stopLoss: { triggerPrice: String(intent.stopLoss) }, takeProfit: { triggerPrice: String(intent.takeProfit) }, timeInForce: PerpsTimeInForce.IOC });
  }
  async cancelAll(): Promise<void> { await this.ready().cancelAllOrders({ instrumentId: this.options.instrumentId }); }
  async close(): Promise<void> { if (this.session) await this.session.close(); }
}
