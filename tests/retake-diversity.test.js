import test from "node:test";
import assert from "node:assert/strict";
import { SECTIONS } from "../js/config.js";
import { MATH_QUESTIONS } from "../data/math.js";
import { ENGLISH_PASSAGES } from "../data/english.js";
import { READING_PASSAGES } from "../data/reading.js";
import { SCIENCE_SETS } from "../data/science.js";
import { drawMathSection, drawEnglishSection, drawReadingSection } from "../js/core/draw.js";
import { drawScienceSection } from "../js/core/science-draw.js";
import { mulberry32 } from "../js/core/random.js";

function exactOverlap(a,b){
  const ids=new Set(a.map(q=>q.id));
  return b.filter(q=>ids.has(q.id)).length;
}

function meanRetakeOverlap(drawFn,pairs=500){
  let sum=0;
  for(let i=1;i<=pairs;i++){
    const a=drawFn(mulberry32(i*2-1));
    const b=drawFn(mulberry32(i*2));
    sum+=exactOverlap(a,b);
  }
  return sum/pairs;
}

test("expanded ACT banks stay within measured retake-overlap ceilings",()=>{
  const values={
    math:meanRetakeOverlap(rng=>drawMathSection(MATH_QUESTIONS,SECTIONS.math,rng)),
    english:meanRetakeOverlap(rng=>drawEnglishSection(ENGLISH_PASSAGES,SECTIONS.english,rng)),
    reading:meanRetakeOverlap(rng=>drawReadingSection(READING_PASSAGES,SECTIONS.reading,rng)),
    science:meanRetakeOverlap(rng=>drawScienceSection(SCIENCE_SETS,SECTIONS.science,rng)),
  };
  for(const [section,value] of Object.entries(values)){
    console.log(`${section} mean retake exact-item overlap: ${value.toFixed(2)}/${SECTIONS[section].totalItems}`);
  }
  assert(values.math<=SECTIONS.math.totalItems*0.40,`math retake overlap ${values.math.toFixed(2)} exceeds the 40% release target`);
  assert(values.english<=SECTIONS.english.totalItems*0.40,`english retake overlap ${values.english.toFixed(2)} exceeds the 40% release target`);
  // Reading and Science remain on temporary draft ceilings until their release-scale expansions land.
  assert(values.reading<=SECTIONS.reading.totalItems*0.50,`reading retake overlap ${values.reading.toFixed(2)} is too high`);
  assert(values.science<=SECTIONS.science.totalItems*0.60,`science retake overlap ${values.science.toFixed(2)} is too high`);
});
