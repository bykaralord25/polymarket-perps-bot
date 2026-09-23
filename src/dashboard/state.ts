import { mkdir, rename, writeFile } from "node:fs/promises";
import type { Position, Signal, Tick } from "../types.js";
export interface ChartPoint { timestamp:number; price:number; rsi:number|null; fast:number|null; slow:number|null; }
export interface DashboardState { marketSource:"polymarket"|"mock"; dataMode:"REAL"|"SIMULATED"; startedAt:number; updatedAt:number; tick:Tick; rsi:number|null; fast:number|null; slow:number|null; signal:Signal; balance:number; startingBalance:number; realizedPnl:number; unrealizedPnl:number; position:Position|null; history:ChartPoint[]; }
export async function writeDashboardState(state:DashboardState):Promise<void>{await mkdir("data",{recursive:true});const tmp="data/dashboard-state.tmp";await writeFile(tmp,JSON.stringify(state),"utf8");await rename(tmp,"data/dashboard-state.json");}
