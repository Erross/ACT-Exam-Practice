import test from "node:test";
import assert from "node:assert/strict";
import { shuffleQuestionChoices } from "../js/core/draw.js";
import { mulberry32 } from "../js/core/random.js";

test("answer-choice shuffling preserves the semantic correct answer",()=>{
  const source={id:"fixture",choices:["correct answer","distractor one","distractor two","distractor three"],correct:"A"};
  const positions=new Set();
  for(let seed=1;seed<=100;seed++){
    const shuffled=shuffleQuestionChoices(source,mulberry32(seed));
    assert.equal(shuffled.choices["ABCD".indexOf(shuffled.correct)],"correct answer");
    positions.add(shuffled.correct);
  }
  assert.equal(positions.size,4);
});
