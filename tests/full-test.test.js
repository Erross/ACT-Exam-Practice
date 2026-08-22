import test from "node:test";
import assert from "node:assert/strict";
import { buildFullTestQueue, fullTestCommitment, fullTestTransition, summarizeFullTest } from "../js/core/full-test.js";
import { SECTIONS } from "../js/config.js";

test("full ACT queue includes Composite sections in official order",()=>{
  assert.deepEqual(buildFullTestQueue(false),["english","math","reading"]);
  assert.deepEqual(buildFullTestQueue(true),["english","math","reading","science"]);
});

test("full-test launch reports the complete displayed-question and timed-minute commitment",()=>{
  assert.deepEqual(fullTestCommitment(SECTIONS,false),{questions:131,minutes:125});
  assert.deepEqual(fullTestCommitment(SECTIONS,true),{questions:171,minutes:165});
});

test("only Mathematics to Reading is labeled as the scheduled standard-time break",()=>{
  const afterEnglish=fullTestTransition("english","math");
  const afterMath=fullTestTransition("math","reading");
  const beforeScience=fullTestTransition("reading","science");
  assert.equal(afterEnglish.kind,"section-transition");
  assert.match(afterEnglish.guidance,/not the scheduled ACT break/i);
  assert.equal(afterMath.kind,"scheduled-break");
  assert.match(afterMath.guidance,/up to 15 minutes/i);
  assert.equal(beforeScience.kind,"optional-transition");
  assert.match(beforeScience.guidance,/optional/i);
});

test("full ACT summary computes form-consistent Composite and STEM estimates",()=>{
  const summary=summarizeFullTest({
    english:{estimate:30,low:29,high:31,byForm:{form1:31,form2:29}},
    math:{estimate:27,low:26,high:28,byForm:{form1:28,form2:26}},
    reading:{estimate:29,low:28,high:30,byForm:{form1:28,form2:30}},
    science:{estimate:36,low:35,high:36,byForm:{form1:35,form2:36}},
  });
  assert.equal(summary.composite,29);
  assert.equal(summary.compositeLow,28);
  assert.equal(summary.compositeHigh,29);
  assert.deepEqual(summary.compositeByForm,{form1:29,form2:28});
  assert.equal(summary.stem,32);
  assert.equal(summary.stemLow,31);
  assert.equal(summary.stemHigh,32);
  assert.deepEqual(summary.stemByForm,{form1:32,form2:31});
  assert.equal(summary.completedCore,true);
  assert.equal(summary.scienceIncluded,true);
  assert.deepEqual(summary.sectionScores,{english:30,math:27,reading:29,science:36});
});

test("Composite range never mixes different official practice forms",()=>{
  const summary=summarizeFullTest({
    english:{estimate:1,low:1,high:1,byForm:{form1:1,form2:1}},
    math:{estimate:5,low:4,high:5,byForm:{form1:5,form2:4}},
    reading:{estimate:27,low:26,high:27,byForm:{form1:26,form2:27}},
  });
  assert.deepEqual(summary.compositeByForm,{form1:11,form2:11});
  assert.equal(summary.composite,11);
  assert.equal(summary.compositeLow,11);
  assert.equal(summary.compositeHigh,11);
});

test("full ACT summary withholds Composite until all Composite sections exist",()=>{
  const summary=summarizeFullTest({english:{estimate:30,byForm:{form1:30,form2:30}},math:{estimate:27,byForm:{form1:27,form2:27}}});
  assert.equal(summary.composite,null);
  assert.equal(summary.compositeLow,null);
  assert.equal(summary.compositeHigh,null);
  assert.equal(summary.stem,null);
  assert.equal(summary.stemLow,null);
  assert.equal(summary.stemHigh,null);
  assert.equal(summary.completedCore,false);
});

test("English-Math-Reading-only full ACT has no STEM estimate",()=>{
  const summary=summarizeFullTest({
    english:{estimate:25,byForm:{form1:25,form2:25}},
    math:{estimate:26,byForm:{form1:26,form2:26}},
    reading:{estimate:27,byForm:{form1:27,form2:27}},
  });
  assert.equal(summary.composite,26);
  assert.equal(summary.stem,null);
  assert.equal(summary.scienceIncluded,false);
});
