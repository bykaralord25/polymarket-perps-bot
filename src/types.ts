export type Side = "long" | "short";
export type Signal = Side | "hold";

export interface Tick {
  symbol: string;
  price: number;
  timestamp: number;
}

export interface Position {
  side: Side;
  symbol: string;
  entryPrice: number;
  quantity: number;
  stopLoss: number;
  takeProfit: number;
  openedAt: number;
}

export interface ClosedTrade extends Position {
  exitPrice: number;
  closedAt: number;
  pnl: number;
  reason: "stop_loss" | "take_profit" | "signal_flip";
}
