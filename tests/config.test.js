import test from "node:test";
import assert from "node:assert/strict";
import { SECTIONS, EXAM, isSectionAvailable } from "../js/config.js";

test("enhanced ACT section counts and timing",()=>{
  assert.deepEqual([SECTIONS.english.totalItems,SECTIONS.english.scoredItems,SECTIONS.english.minutes],[50,40,35]);
  assert.deepEqual([SECTIONS.math.totalItems,SECTIONS.math.scoredItems,SECTIONS.math.minutes],[45,41,50]);
  assert.deepEqual([SECTIONS.reading.totalItems,SECTIONS.reading.scoredItems,SECTIONS.reading.minutes],[36,27,40]);
  assert.deepEqual([SECTIONS.science.totalItems,SECTIONS.science.scoredItems,SECTIONS.science.minutes],[40,34,40]);
  assert.deepEqual(EXAM.compositeSections,["english","math","reading"]);
});

test("V1 production sections are explicitly released",()=>{
  assert.deepEqual(Object.values(SECTIONS).map(section=>section.status),["released","released","released","released"]);
});

test("draft and released sections remain launchable while planned sections do not",()=>{
  assert.equal(isSectionAvailable({status:"draft"}),true);
  assert.equal(isSectionAvailable({status:"released"}),true);
  assert.equal(isSectionAvailable({status:"planned"}),false);
  assert.equal(isSectionAvailable(null),false);
});

test("math fixed form remains inside final enhanced ACT reporting-category ranges",()=>{
  const q=SECTIONS.math.operationalBlueprint;
  assert.equal(q.NQ+q.A+q.F+q.G+q.S,33);
  assert.equal(q.IES,8);
  assert.equal(Object.values(q).reduce((a,b)=>a+b,0),41);
  assert(q.NQ>=4 && q.NQ<=5);
  assert(q.A>=7 && q.A<=8);
  assert(q.F>=7 && q.F<=8);
  assert(q.G>=7 && q.G<=8);
  assert(q.S>=5 && q.S<=6);
  assert(SECTIONS.math.modelingMinimum>=8);
});
