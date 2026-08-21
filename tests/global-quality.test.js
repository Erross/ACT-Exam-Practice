import test from "node:test";
import assert from "node:assert/strict";
import { MATH_QUESTIONS } from "../data/math.js";
import { ENGLISH_PASSAGES } from "../data/english.js";
import { READING_PASSAGES } from "../data/reading.js";
import { SCIENCE_SETS } from "../data/science.js";

const BANKS={
  math:MATH_QUESTIONS,
  english:ENGLISH_PASSAGES.flatMap(p=>p.questions),
  reading:READING_PASSAGES.flatMap(p=>p.questions),
  science:SCIENCE_SETS.flatMap(s=>s.questions),
};

function correctChoice(q){
  const index="ABCD".indexOf(q.correct);
  return index>=0 ? q.choices[index] : null;
}

function uniquelyLongestCorrectRate(questions){
  let hits=0;
  for(const q of questions){
    const lengths=q.choices.map(c=>String(c).trim().length);
    const correctIndex="ABCD".indexOf(q.correct);
    const max=Math.max(...lengths);
    if(lengths[correctIndex]===max && lengths.filter(n=>n===max).length===1) hits++;
  }
  return hits/questions.length;
}

test("all browser-effective question IDs are globally unique and schemas remain sound",()=>{
  const ids=new Set();
  let total=0;
  for(const [section,questions] of Object.entries(BANKS)){
    assert(questions.length>0,`${section} bank is empty`);
    for(const q of questions){
      total++;
      assert(!ids.has(q.id),`duplicate global question id ${q.id}`); ids.add(q.id);
      assert.equal(typeof q.stem,"string",`${q.id} missing stem`); assert(q.stem.trim().length>=10,`${q.id} stem too short`);
      assert.equal(q.choices.length,4,`${q.id} must have four choices`);
      const normalized=q.choices.map(c=>String(c).trim().toLowerCase());
      assert.equal(new Set(normalized).size,4,`${q.id} has duplicate answer choices`);
      assert.match(q.correct,/^[ABCD]$/,`${q.id} has invalid semantic key`);
      const answer=correctChoice(q);
      assert(answer && String(answer).trim().length>0,`${q.id} correct answer is empty`);
      assert.equal(typeof q.rationale,"string",`${q.id} missing rationale`);
      assert(q.rationale.trim().length>=20,`${q.id} rationale too short`);
    }
  }
  assert.equal(total,334,"update this intentional bank-size checkpoint when adding reviewed content");
});

test("no section has a severe uniquely-longest-correct-answer tell",()=>{
  for(const [section,questions] of Object.entries(BANKS)){
    const rate=uniquelyLongestCorrectRate(questions);
    console.log(`${section} uniquely-longest-correct rate: ${(rate*100).toFixed(1)}%`);
    assert(rate<0.55,`${section} uniquely-longest-correct rate ${(rate*100).toFixed(1)}% is too high`);
  }
});
