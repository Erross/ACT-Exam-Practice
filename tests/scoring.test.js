import test from "node:test"; import assert from "node:assert/strict";
import { estimateSectionScore, estimateComposite } from "../js/core/scoring.js";
test("perfect raw scores estimate 36",()=>{
  for (const [id,raw] of Object.entries({english:40,math:41,reading:27,science:34})) assert.equal(estimateSectionScore(id,raw).estimate,36);
});
test("score ranges preserve official practice-form variation",()=>{
  const math35=estimateSectionScore("math",35); assert.deepEqual([math35.low,math35.high],[30,32]);
  const science30=estimateSectionScore("science",30); assert.deepEqual([science30.low,science30.high],[30,32]);
});
test("composite uses English Math Reading only",()=> assert.equal(estimateComposite({english:30,math:27,reading:29,science:36}),29));
