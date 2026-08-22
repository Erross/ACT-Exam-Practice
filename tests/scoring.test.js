import test from "node:test";
import assert from "node:assert/strict";
import { estimateSectionScore, estimateComposite } from "../js/core/scoring.js";

test("perfect raw scores estimate 36 on every practice form",()=>{
  for(const [id,raw] of Object.entries({english:40,math:41,reading:27,science:34})){
    const result=estimateSectionScore(id,raw);
    assert.equal(result.estimate,36);
    assert.deepEqual(result.byForm,{form1:36,form2:36});
  }
});

test("score ranges preserve official practice-form variation and identity",()=>{
  const math35=estimateSectionScore("math",35);
  assert.deepEqual([math35.low,math35.high],[30,32]);
  assert.deepEqual(math35.byForm,{form1:32,form2:30});
  const science30=estimateSectionScore("science",30);
  assert.deepEqual([science30.low,science30.high],[30,32]);
  assert.deepEqual(science30.byForm,{form1:32,form2:30});
});

test("composite uses English Math Reading only",()=>{
  assert.equal(estimateComposite({english:30,math:27,reading:29,science:36}),29);
});
