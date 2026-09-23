import assert from "node:assert/strict";
import { createExecutionController, createLiveExecutionBackend, createPaperExecutionBackend } from "../src/trading/execution-controller.js";

const paper=createExecutionController("paper");
assert.equal(paper.mode,"paper");
assert.equal(paper.canSendRealOrders,false);
await paper.stop();
assert.throws(()=>createExecutionController("live"),/safety lock/);

const directPaper=createPaperExecutionBackend();
assert.equal(directPaper.mode,"paper");
assert.equal(directPaper.canSendRealOrders,false);

let removed=0,stopped=0;
const live=createLiveExecutionBackend({
  instrument:{instrumentId:7,symbol:"BTC-USD",rules:{minNotional:10,maxMarketNotional:5000,maxLeverage:5,quantityDecimals:3,isolatedOnly:false}},
  removeSignalHandlers:()=>{removed++},
  runtime:{engine:{} as never,stop:async()=>{stopped++}}
});
assert.equal(live.mode,"live");
assert.equal(live.canSendRealOrders,true);
await live.stop();
assert.equal(removed,1);
assert.equal(stopped,1);
console.log("execution controller tests passed");
