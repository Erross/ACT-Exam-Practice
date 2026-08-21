import test from "node:test"; import assert from "node:assert/strict";
import { MATH_QUESTIONS } from "../data/math.js"; import { SECTIONS } from "../js/config.js";
import { drawMathSection, countBy } from "../js/core/draw.js"; import { mulberry32 } from "../js/core/random.js";
test("500 math draws satisfy scored blueprint and field-test count",()=>{
 for(let seed=1;seed<=500;seed++){
  const draw=drawMathSection(MATH_QUESTIONS,SECTIONS.math,mulberry32(seed));
  assert.equal(draw.length,45); assert.equal(draw.filter(q=>q.scored).length,41); assert.equal(draw.filter(q=>!q.scored).length,4);
  const scored=draw.filter(q=>q.scored); const counts=countBy(scored,q=>q.category);
  assert.deepEqual(counts,{NQ:5,A:7,F:8,G:8,S:5,IES:8});
  assert.equal(counts.NQ+counts.A+counts.F+counts.G+counts.S,33);
  assert.equal(counts.IES,8);
  assert(scored.filter(q=>q.modeling).length>=8);
  assert.equal(new Set(draw.map(q=>q.variantGroup)).size,45);
 }
});
test("retake exact-item overlap is measured",()=>{
 let total=0, n=0;
 for(let seed=1;seed<=200;seed+=2){
  const a=drawMathSection(MATH_QUESTIONS,SECTIONS.math,mulberry32(seed)); const b=drawMathSection(MATH_QUESTIONS,SECTIONS.math,mulberry32(seed+1));
  const ids=new Set(a.map(q=>q.id)); total+=b.filter(q=>ids.has(q.id)).length; n++;
 }
 const avg=total/n; assert(avg<25,`average overlap ${avg}`); console.log(`mean exact-item overlap: ${avg.toFixed(2)}/45`);
});
