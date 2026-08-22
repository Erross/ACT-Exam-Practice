import test from "node:test"; import assert from "node:assert/strict";
import { MATH_QUESTIONS } from "../data/math.js";
const valid=new Set(["NQ","A","F","G","S","IES"]);
test("math bank has launch-target scale",()=> assert.equal(MATH_QUESTIONS.length,140));
test("math bank schema and unique IDs",()=>{
 const ids=new Set();
 for(const q of MATH_QUESTIONS){assert(!ids.has(q.id));ids.add(q.id);assert(valid.has(q.category));assert.equal(q.choices.length,4);assert.equal(new Set(q.choices).size,4);assert.match(q.correct,/^[ABCD]$/);assert(q.rationale.length>=20);assert(q.variantGroup);}
});
test("math bank has 70 two-item variant families",()=>{
 const counts={}; for(const q of MATH_QUESTIONS) counts[q.variantGroup]=(counts[q.variantGroup]||0)+1;
 assert.equal(Object.keys(counts).length,70); assert(Object.values(counts).every(n=>n===2));
});
test("answer positions are not conspicuously imbalanced",()=>{
 const c={A:0,B:0,C:0,D:0}; for(const q of MATH_QUESTIONS)c[q.correct]++;
 for(const n of Object.values(c)) assert(n>=20 && n<=50,JSON.stringify(c));
});
test("wall-rate item asks explicitly for wall-equivalent area rather than an impossible fraction of one wall",()=>{
 const q=MATH_QUESTIONS.find(row=>row.id==="M-IES-WORK-2");
 assert(q);
 assert.match(q.stem,/standard-wall equivalents of area/i);
 assert.equal(q.choices["ABCD".indexOf(q.correct)],"3/2");
 assert.match(q.rationale,/3\/2 standard-wall equivalents/i);
});
