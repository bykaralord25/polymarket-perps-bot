import { mkdir, appendFile } from "node:fs/promises";
import type { ClosedTrade, Position, Side, Tick } from "../types.js";
import { RiskManager } from "../risk/risk-manager.js";

export class PaperEngine {
  private position: Position | null = null;
  private balance: number;
  private readonly startOfDayBalance: number;

  constructor(
    startingBalance: number,
    private readonly risk: RiskManager
  ) {
    this.balance = startingBalance;
    this.startOfDayBalance = startingBalance;
  }

  get state() {
    return { balance: this.balance, position: this.position };
  }

  async onTick(tick: Tick): Promise<void> {
    if (!this.position) return;
    const p = this.position;
    const hitStop = p.side === "long" ? tick.price <= p.stopLoss : tick.price >= p.stopLoss;
    const hitTake = p.side === "long" ? tick.price >= p.takeProfit : tick.price <= p.takeProfit;
    if (hitStop) await this.close(tick, "stop_loss");
    else if (hitTake) await this.close(tick, "take_profit");
  }

  async open(side: Side, tick: Tick): Promise<boolean> {
    if (this.position || !this.risk.canTrade(this.startOfDayBalance, this.balance)) return false;
    const { stopLoss, takeProfit } = this.risk.levels(side, tick.price);
    const quantity = this.risk.quantity(this.balance, tick.price, stopLoss);
    if (quantity <= 0) return false;

    this.position = {
      side,
      symbol: tick.symbol,
      entryPrice: tick.price,
      quantity,
      stopLoss,
      takeProfit,
      openedAt: tick.timestamp
    };
    await this.log({ event: "open", ...this.position });
    return true;
  }

  async flipIfNeeded(side: Side, tick: Tick): Promise<void> {
    if (this.position && this.position.side !== side) {
      await this.close(tick, "signal_flip");
      await this.open(side, tick);
    } else if (!this.position) {
      await this.open(side, tick);
    }
  }

  private async close(tick: Tick, reason: ClosedTrade["reason"]): Promise<void> {
    if (!this.position) return;
    const p = this.position;
    const direction = p.side === "long" ? 1 : -1;
    const pnl = (tick.price - p.entryPrice) * p.quantity * direction;
    this.balance += pnl;
    const trade: ClosedTrade = {
      ...p,
      exitPrice: tick.price,
      closedAt: tick.timestamp,
      pnl,
      reason
    };
    this.position = null;
    await this.log({ event: "close", balance: this.balance, ...trade });
  }

  private async log(record: unknown): Promise<void> {
    await mkdir("data", { recursive: true });
    await appendFile("data/trades.jsonl", JSON.stringify(record) + "\n", "utf8");
  }
}
