import test from "node:test"; import assert from "node:assert/strict";
import { SECTIONS, EXAM } from "../js/config.js";
test("enhanced ACT section counts and timing",()=>{
  assert.deepEqual([SECTIONS.english.totalItems,SECTIONS.english.scoredItems,SECTIONS.english.minutes],[50,40,35]);
  assert.deepEqual([SECTIONS.math.totalItems,SECTIONS.math.scoredItems,SECTIONS.math.minutes],[45,41,50]);
  assert.deepEqual([SECTIONS.reading.totalItems,SECTIONS.reading.scoredItems,SECTIONS.reading.minutes],[36,27,40]);
  assert.deepEqual([SECTIONS.science.totalItems,SECTIONS.science.scoredItems,SECTIONS.science.minutes],[40,34,40]);
  assert.deepEqual(EXAM.compositeSections,["english","math","reading"]);
});
