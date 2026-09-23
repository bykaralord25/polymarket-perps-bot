import "dotenv/config";
import { polymarketFeed } from "./market/polymarket-feed.js";
import { RiskManager } from "./risk/risk-manager.js";
import { SignalEngine } from "./strategy/signal-engine.js";
import { startLiveExecution } from "./trading/live-startup.js";

const confirm=process.env.LIVE_CONFIRM;
const privateKey=process.env.POLYMARKET_PRIVATE_KEY?.trim()??"";
const wallet=process.env.POLYMARKET_DEPOSIT_WALLET?.trim()||undefined;
const symbol=process.env.SYMBOL?.trim()||"BTC";
const leverage=Number(process.env.MAX_LEVERAGE??2);
const riskPerTrade=Number(process.env.RISK_PER_TRADE??0.01);
const stopLossPct=Number(process.env.STOP_LOSS_PCT??0.01);
const takeProfitPct=Number(process.env.TAKE_PROFIT_PCT??0.02);
const dailyLossLimitPct=Number(process.env.DAILY_LOSS_LIMIT_PCT??0.03);
const maxOrderNotional=Number(process.env.LIVE_MAX_ORDER_NOTIONAL??25);
const tickInterval=Number(process.env.TICK_INTERVAL_MS??1000);

if(confirm!=="I_UNDERSTAND_REAL_MONEY") throw new Error("LIVE LOCKED: set LIVE_CONFIRM=I_UNDERSTAND_REAL_MONEY explicitly.");
if(!privateKey) throw new Error("LIVE LOCKED: POLYMARKET_PRIVATE_KEY is missing.");
if(!Number.isFinite(maxOrderNotional)||maxOrderNotional<=0) throw new Error("LIVE LOCKED: LIVE_MAX_ORDER_NOTIONAL must be positive.");

console.log("LIVE REAL-MONEY MODE. Orders can use real funds.");
console.log(`Symbol=${symbol} leverage=${leverage}x maxOrderNotional=$${maxOrderNotional}`);

const backend=await startLiveExecution(
  {privateKey,wallet},
  {symbol,leverage,maxOrderNotional,autoCancelMs:60_000,maxPriceAgeMs:10_000}
);
if(backend.mode!=="live") throw new Error("Live backend was not created.");

const engine=backend.bootstrap.runtime.engine;
const rules=backend.bootstrap.instrument.rules;
const signals=new SignalEngine();
const risk=new RiskManager(riskPerTrade,leverage,stopLossPct,takeProfitPct,dailyLossLimitPct);
let startEquity:number|null=null;

function floorQuantity(value:number,decimals:number){
  const scale=10**decimals;
  return Math.floor(value*scale)/scale;
}

try{
  for await(const tick of polymarketFeed(symbol,tickInterval)){
    const result=signals.update(tick.price);
    if(result.signal==="hold") continue;

    const snapshot=await engine.accountSnapshot();
    if(snapshot.portfolio.inLiquidation) throw new Error("LIVE STOP: account is in liquidation.");
    const equity=Number(snapshot.portfolio.margin.totalAccountValue);
    if(!Number.isFinite(equity)||equity<=0) throw new Error("LIVE STOP: invalid account equity.");
    startEquity??=equity;
    if(!risk.canTrade(startEquity,equity)) throw new Error("LIVE STOP: daily loss guard reached.");

    const position=snapshot.portfolio.positions.find(p=>Number(p.instrumentId)===backend.bootstrap.instrument.instrumentId&&Number(p.size)!==0);
    if(position){
      console.log(`Signal ${result.signal.toUpperCase()} ignored: an existing ${position.symbol} position is open.`);
      continue;
    }

    const levels=risk.levels(result.signal,tick.price);
    const riskQuantity=risk.quantity(equity,tick.price,levels.stopLoss);
    const notionalQuantity=maxOrderNotional/tick.price;
    const quantity=floorQuantity(Math.min(riskQuantity,notionalQuantity),rules.quantityDecimals);
    if(quantity<=0||quantity*tick.price<rules.minNotional){
      console.log("Signal blocked: safe quantity is below the instrument minimum notional.");
      continue;
    }

    await engine.open({side:result.signal,tick,quantity,stopLoss:levels.stopLoss,takeProfit:levels.takeProfit});
    console.log(`LIVE ${result.signal.toUpperCase()} order submitted: qty=${quantity} price~${tick.price}`);
  }
}finally{
  await backend.stop();
}
