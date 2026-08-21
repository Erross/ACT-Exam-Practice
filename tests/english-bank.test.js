import test from "node:test";
import assert from "node:assert/strict";
import { ENGLISH_PASSAGES } from "../data/english.js";

const validCategories=new Set(["POW","KLA","CSE"]);

test("initial English bank is runnable at 4 long + 4 short passages",()=>{
  assert.equal(ENGLISH_PASSAGES.length,8);
  assert.equal(ENGLISH_PASSAGES.filter(p=>p.length==="long").length,4);
  assert.equal(ENGLISH_PASSAGES.filter(p=>p.length==="short").length,4);
  assert.equal(ENGLISH_PASSAGES.reduce((n,p)=>n+p.questions.length,0),60);
});

test("English passage and question schema is internally consistent",()=>{
  const passageIds=new Set(); const questionIds=new Set();
  for(const p of ENGLISH_PASSAGES){
    assert(!passageIds.has(p.id)); passageIds.add(p.id);
    assert(p.title && p.text && p.genre);
    assert.equal(p.questions.length,p.length==="long"?10:5);
    const counts={POW:0,KLA:0,CSE:0};
    for(const q of p.questions){
      assert(!questionIds.has(q.id)); questionIds.add(q.id);
      assert.equal(q.section,"english"); assert(validCategories.has(q.category)); counts[q.category]++;
      assert.equal(q.choices.length,4); assert.equal(new Set(q.choices).size,4);
      assert.match(q.correct,/^[ABCD]$/); assert(q.rationale.length>=30);
    }
    if(p.length==="long") assert.deepEqual(counts,{POW:4,KLA:2,CSE:4});
    else assert.deepEqual(counts,{POW:2,KLA:1,CSE:2});
  }
});
