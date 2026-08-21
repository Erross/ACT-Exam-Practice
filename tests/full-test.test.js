import test from "node:test";
import assert from "node:assert/strict";
import { buildFullTestQueue, summarizeFullTest } from "../js/core/full-test.js";

test("full ACT queue includes core sections in official Composite order",()=>{
  assert.deepEqual(buildFullTestQueue(false),["english","math","reading"]);
  assert.deepEqual(buildFullTestQueue(true),["english","math","reading","science"]);
});

test("full ACT summary computes Composite from English, Math, and Reading only",()=>{
  const summary=summarizeFullTest({
    english:{estimate:30,low:29,high:31},
    math:{estimate:27,low:26,high:28},
    reading:{estimate:29,low:28,high:30},
    science:{estimate:36,low:35,high:36},
  });
  assert.equal(summary.composite,29);
  assert.equal(summary.compositeLow,28);
  assert.equal(summary.compositeHigh,30);
  assert.equal(summary.completedCore,true);
  assert.equal(summary.scienceIncluded,true);
  assert.deepEqual(summary.sectionScores,{english:30,math:27,reading:29,science:36});
});

test("full ACT summary withholds Composite until all core sections exist",()=>{
  const summary=summarizeFullTest({english:{estimate:30,low:29,high:31},math:{estimate:27,low:26,high:28}});
  assert.equal(summary.composite,null);
  assert.equal(summary.compositeLow,null);
  assert.equal(summary.compositeHigh,null);
  assert.equal(summary.completedCore,false);
});
