import assert from "node:assert/strict";
import { startLiveExecution } from "../src/trading/live-startup.js";

await assert.rejects(
  ()=>startLiveExecution({privateKey:""},{symbol:"BTC",leverage:2}),
  /private key is missing/
);

let created=0,bootstrapped=0,closed=0,stopped=0;
const session={close:async()=>{closed++}};
const bootstrap={
  instrument:{instrumentId:7,symbol:"BTC-USD",rules:{minNotional:10,maxMarketNotional:5000,maxLeverage:5,quantityDecimals:3,isolatedOnly:false}},
  removeSignalHandlers:()=>{},
  runtime:{engine:{} as never,stop:async()=>{stopped++}}
};
const backend=await startLiveExecution(
  {privateKey:"0x"+"11".repeat(32)},
  {symbol:"BTC",leverage:2,maxOrderNotional:100},
  {
    createSession:async()=>{created++;return session as never},
    bootstrap:async(_session,options)=>{bootstrapped++;assert.equal(options.symbol,"BTC");assert.equal(options.leverage,2);return bootstrap as never}
  }
);
assert.equal(backend.mode,"live");
assert.equal(backend.canSendRealOrders,true);
assert.equal(created,1);
assert.equal(bootstrapped,1);
await backend.stop();
assert.equal(stopped,1);
assert.equal(closed,0);

let failedClose=0;
await assert.rejects(
  ()=>startLiveExecution(
    {privateKey:"0x"+"22".repeat(32)},
    {symbol:"BTC",leverage:2},
    {
      createSession:async()=>({close:async()=>{failedClose++}} as never),
      bootstrap:async()=>{throw new Error("preflight failed")}
    }
  ),
  /preflight failed/
);
assert.equal(failedClose,1);
console.log("live startup tests passed");
