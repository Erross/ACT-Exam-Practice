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

function meanRetakeOverlap(drawFn,pairs=5000){
  let sum=0;
  for(let i=1;i<=pairs;i++){
    const a=drawFn(mulberry32(i*2-1));
    const b=drawFn(mulberry32(i*2));
    sum+=exactOverlap(a,b);
  }
  return sum/pairs;
}

test("release-scale ACT banks stay at or below 40% mean exact-item retake overlap across 5,000 pairs",()=>{
  const values={
    math:meanRetakeOverlap(rng=>drawMathSection(MATH_QUESTIONS,SECTIONS.math,rng)),
    english:meanRetakeOverlap(rng=>drawEnglishSection(ENGLISH_PASSAGES,SECTIONS.english,rng)),
    reading:meanRetakeOverlap(rng=>drawReadingSection(READING_PASSAGES,SECTIONS.reading,rng)),
    science:meanRetakeOverlap(rng=>drawScienceSection(SCIENCE_SETS,SECTIONS.science,rng)),
  };
  for(const [section,value] of Object.entries(values)){
    console.log(`${section} mean retake exact-item overlap across 5,000 pairs: ${value.toFixed(2)}/${SECTIONS[section].totalItems} (${(100*value/SECTIONS[section].totalItems).toFixed(1)}%)`);
    assert(value<=SECTIONS[section].totalItems*0.40,`${section} retake overlap ${value.toFixed(2)} exceeds the 40% release target`);
  }
});
