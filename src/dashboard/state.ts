import { mkdir, writeFile } from "node:fs/promises";
import type { Position, Signal, Tick } from "../types.js";

export interface DashboardState {
  updatedAt: number;
  tick: Tick;
  rsi: number | null;
  fast: number | null;
  slow: number | null;
  signal: Signal;
  balance: number;
  startingBalance: number;
  realizedPnl: number;
  unrealizedPnl: number;
  position: Position | null;
}

export async function writeDashboardState(state: DashboardState): Promise<void> {
  await mkdir("data", { recursive: true });
  await writeFile("data/dashboard-state.json", JSON.stringify(state), "utf8");
}
