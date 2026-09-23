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
await assert.rejects(()=>bootstrapLiveExecution(session as never,{enabled:false,instrumentId:1,leverage:1}),/explicit live enable/);
const boot=await bootstrapLiveExecution(session as never,{enabled:true,instrumentId:1,leverage:1,autoCancelMs:60_000});
assert.deepEqual(calls,["leverage","arm"]);
boot.removeSignalHandlers();
await boot.runtime.stop();
assert.deepEqual(calls,["leverage","arm","cancel","disarm","close"]);
console.log("live bootstrap tests passed");
