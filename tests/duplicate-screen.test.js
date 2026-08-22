import test from "node:test";
import assert from "node:assert/strict";
import { MATH_QUESTIONS } from "../data/math.js";
import { ENGLISH_PASSAGES } from "../data/english.js";
import { READING_PASSAGES } from "../data/reading.js";
import { SCIENCE_SETS } from "../data/science.js";

function normalize(text){
  return String(text||"")
    .toLowerCase()
    .replace(/[−–—]/g,"-")
    .replace(/[^a-z0-9]+/g," ")
    .trim()
    .replace(/\s+/g," ");
}

function shingles(text,size=2){
  const tokens=normalize(text).split(" ").filter(Boolean);
  const out=new Set();
  if(tokens.length<size){ if(tokens.length) out.add(tokens.join(" ")); return out; }
  for(let i=0;i<=tokens.length-size;i++) out.add(tokens.slice(i,i+size).join(" "));
  return out;
}

function jaccard(a,b){
  if(!a.size && !b.size) return 1;
  let overlap=0;
  for(const value of a) if(b.has(value)) overlap++;
  return overlap/(a.size+b.size-overlap);
}

const questions=[
  ...MATH_QUESTIONS.map(q=>({...q,_section:"math"})),
  ...ENGLISH_PASSAGES.flatMap(p=>p.questions.map(q=>({...q,_section:"english",_group:p.id}))),
  ...READING_PASSAGES.flatMap(p=>p.questions.map(q=>({...q,_section:"reading",_group:p.id}))),
  ...SCIENCE_SETS.flatMap(s=>s.questions.map(q=>({...q,_section:"science",_group:s.id}))),
];

function questionFingerprint(q){
  return normalize(`${q.stem} || ${q.choices.join(" || ")}`);
}

function similarityText(q){
  return `${q.stem} ${q.choices.join(" ")}`;
}

test("effective bank contains no accidental exact duplicate question fingerprints",()=>{
  const seen=new Map();
  const duplicates=[];
  for(const q of questions){
    const fp=questionFingerprint(q);
    const prior=seen.get(fp);
    if(prior && !(q._section==="math" && prior.variantGroup===q.variantGroup)) duplicates.push(`${prior.id} == ${q.id}`);
    else seen.set(fp,q);
  }
  assert.deepEqual(duplicates,[],`Exact duplicate effective questions:\n${duplicates.join("\n")}`);
});

test("effective English, Reading, and Science stimuli are not exact duplicates",()=>{
  const stimuli=[
    ...ENGLISH_PASSAGES.map(p=>({id:p.id,text:p.text})),
    ...READING_PASSAGES.map(p=>({id:p.id,text:p.displayText||p.text})),
    ...SCIENCE_SETS.map(s=>({id:s.id,text:s.displayText||s.text})),
  ];
  const seen=new Map();
  const duplicates=[];
  for(const item of stimuli){
    const fp=normalize(item.text);
    const prior=seen.get(fp);
    if(prior) duplicates.push(`${prior} == ${item.id}`);
    else seen.set(fp,item.id);
  }
  assert.deepEqual(duplicates,[],`Exact duplicate effective stimuli:\n${duplicates.join("\n")}`);
});

test("whole-bank high-similarity screen finds no ungrouped near-duplicate questions",()=>{
  const prepared=questions.map(q=>({q,grams:shingles(similarityText(q),2)}));
  const suspicious=[];
  for(let i=0;i<prepared.length;i++){
    for(let j=i+1;j<prepared.length;j++){
      const a=prepared[i].q,b=prepared[j].q;
      if(a._section==="math" && b._section==="math" && a.variantGroup===b.variantGroup) continue;
      // Passage-based items can legitimately reuse a generic stem such as "Which conclusion is best supported?";
      // requiring choices in the similarity text keeps this screen focused on duplicated item substance.
      const score=jaccard(prepared[i].grams,prepared[j].grams);
      if(score>=0.88) suspicious.push(`${a.id} ~ ${b.id}: ${(100*score).toFixed(1)}%`);
    }
  }
  assert.deepEqual(suspicious,[],`Potential ungrouped near-duplicate questions:\n${suspicious.join("\n")}`);
});
