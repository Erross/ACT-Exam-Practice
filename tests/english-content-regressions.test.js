import test from "node:test";
import assert from "node:assert/strict";
import { ENGLISH_PASSAGES } from "../data/english.js";

const questions=new Map(ENGLISH_PASSAGES.flatMap(p=>p.questions).map(q=>[q.id,q]));

test("reviewed English editing directions identify the exact target",()=>{
  assert.match(questions.get("E-L1-Q2").stem,/introductory phrase/i);
  assert.doesNotMatch(questions.get("E-L1-Q2").stem,/dependent idea/i);
  assert.match(questions.get("E-L1-Q4").stem,/so that/i);
  assert.match(questions.get("E-L3-Q5").stem,/sentence 6/i);
  assert.match(questions.get("E-L3-Q8").stem,/best begins sentence 10/i);
});
