import type { Side } from "../types.js";

export class RiskManager {
  constructor(
    private readonly riskPerTrade: number,
    private readonly maxLeverage: number,
    private readonly stopLossPct: number,
    private readonly takeProfitPct: number,
    private readonly dailyLossLimitPct: number
  ) {}

  levels(side: Side, price: number) {
    const direction = side === "long" ? 1 : -1;
    return {
      stopLoss: price * (1 - direction * this.stopLossPct),
      takeProfit: price * (1 + direction * this.takeProfitPct)
    };
  }

  quantity(balance: number, entry: number, stop: number): number {
    const riskBudget = balance * this.riskPerTrade;
    const riskPerUnit = Math.abs(entry - stop);
    if (riskPerUnit <= 0) return 0;
    const riskSized = riskBudget / riskPerUnit;
    const leverageCap = (balance * this.maxLeverage) / entry;
    return Math.max(0, Math.min(riskSized, leverageCap));
  }

  canTrade(startOfDayBalance: number, balance: number): boolean {
    const drawdown = (startOfDayBalance - balance) / startOfDayBalance;
    return drawdown < this.dailyLossLimitPct;
  }
}
