import assert from "node:assert/strict";
import { startLiveRuntime } from "../src/trading/live-runtime.js";

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
const runtime=await startLiveRuntime(session as never,{enabled:true,instrumentId:1,leverage:2,autoCancelMs:60_000});
assert.deepEqual(calls,["leverage","arm"]);
await runtime.stop();
assert.deepEqual(calls,["leverage","arm","cancel","disarm","close"]);
await runtime.stop();
assert.deepEqual(calls,["leverage","arm","cancel","disarm","close"]);

const failed:string[]=[];
const broken={
  ...session,
  fetchBalances:async()=>[],
  cancelAllOrders:async()=>{failed.push("cancel")},
  close:async()=>{failed.push("close")}
};
await assert.rejects(
  ()=>startLiveRuntime(broken as never,{enabled:true,instrumentId:1,leverage:1}),
  /no account balances/
);
assert.deepEqual(failed,["cancel","close"]);
console.log("live runtime tests passed");
