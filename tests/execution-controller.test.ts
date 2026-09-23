import assert from "node:assert/strict";
import { createExecutionController } from "../src/trading/execution-controller.js";

const paper=createExecutionController("paper");
assert.equal(paper.mode,"paper");
assert.equal(paper.canSendRealOrders,false);
assert.throws(()=>createExecutionController("live"),/safety lock/);
console.log("execution controller tests passed");
