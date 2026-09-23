import assert from "node:assert/strict";
import { bootstrapLiveExecution } from "../src/trading/live-bootstrap.js";

const calls:string[]=[];
const session={
  fetchBalances:async()=>[{asset:"USDC",available:"100"}],
  fetchPortfolio:async()=>({positions:[]}),
  fetchOpenOrders:async()=>[],
  fetchAutoCancelStatus:async()=>({armed:false}),
  updateLeverage:async()=>{calls.push("leverage");return{}},
  armAutoCancel:async()=>{calls.push("arm")},
  disarmAutoCancel:async()=>{calls.push("disarm")},
  cancelAllOrders:async()=>{calls.push("cancel")},
  close:async()=>{calls.push("close")}
};
const resolved={instrumentId:7,symbol:"BTC-USD",rules:{minNotional:10,maxMarketNotional:5000,maxLeverage:5,quantityDecimals:3,isolatedOnly:false}};
const resolver=async(symbol:string)=>{assert.equal(symbol,"BTC");return resolved};
await assert.rejects(()=>bootstrapLiveExecution(session as never,{enabled:false,symbol:"BTC",leverage:1},resolver),/explicit live enable/);
const boot=await bootstrapLiveExecution(session as never,{enabled:true,symbol:"BTC",leverage:2,autoCancelMs:60_000},resolver);
assert.equal(boot.instrument.instrumentId,7);
assert.equal(boot.instrument.rules.maxLeverage,5);
assert.deepEqual(calls,["leverage","arm"]);
boot.removeSignalHandlers();
await boot.runtime.stop();
assert.deepEqual(calls,["leverage","arm","cancel","disarm","close"]);

await assert.rejects(
  ()=>bootstrapLiveExecution(session as never,{enabled:true,symbol:"BTC",leverage:6},resolver),
  /instrument maximum/
);
console.log("live bootstrap tests passed");
