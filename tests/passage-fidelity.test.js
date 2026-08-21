import test from "node:test";
import assert from "node:assert/strict";
import { SECTIONS } from "../js/config.js";
import { ENGLISH_PASSAGES } from "../data/english.js";
import { READING_PASSAGES } from "../data/reading.js";
import { SCIENCE_SETS } from "../data/science.js";

function wordCount(text){
  return String(text)
    .replace(/\[\d+\]/g," ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function inRange(value,[min,max]){ return value>=min && value<=max; }

function validateTable(spec,id,problems){
  if(!spec || !Array.isArray(spec.columns) || spec.columns.length<2 || !Array.isArray(spec.rows) || !spec.rows.length){
    problems.push(`${id}: invalid structured table`); return;
  }
  if(!spec.caption || spec.caption.trim().length<10) problems.push(`${id}: table needs a meaningful caption`);
  for(const row of spec.rows){
    if(!Array.isArray(row) || row.length!==spec.columns.length) problems.push(`${id}: table row/column mismatch`);
  }
}

function containsPipeTable(text){
  return String(text).split(/\n/).some(line=>(line.match(/\|/g)||[]).length>=2);
}

test("English and Reading passages match final enhanced ACT length and metadata targets",()=>{
  const problems=[];
  const englishCounts=[];
  for(const passage of ENGLISH_PASSAGES){
    const count=wordCount(passage.text); englishCounts.push(`${passage.id}=${count}`);
    if(!["informational","argumentative","narrative"].includes(passage.writingType)) problems.push(`${passage.id}: invalid writingType ${passage.writingType}`);
    if(!["HUM","SSC","NSC"].includes(passage.domain)) problems.push(`${passage.id}: invalid content domain ${passage.domain}`);
    const range=SECTIONS.english.passageWordRanges[passage.length];
    if(!range || !inRange(count,range)) problems.push(`${passage.id}: ${count} words outside ${range?.join("-")}`);
  }
  const readingCounts=[];
  for(const passage of READING_PASSAGES){
    const count=wordCount(passage.text); readingCounts.push(`${passage.id}=${count}`);
    const range=SECTIONS.reading.passageWordRanges[String(passage.length)];
    if(!range || !inRange(count,range)) problems.push(`${passage.id}: ${count} words outside ${range?.join("-")}`);
    if(passage.format==="vqi"){
      if(!passage.supplement) problems.push(`${passage.id}: VQI passage lacks structured supplement`);
      else validateTable(passage.supplement,passage.id,problems);
      if(!passage.displayText || passage.displayText===passage.text) problems.push(`${passage.id}: VQI browser text must separate prose from structured data`);
      if(containsPipeTable(passage.displayText)) problems.push(`${passage.id}: VQI browser text duplicates pipe-delimited table data`);
    }
  }
  console.log(`English passage word counts: ${englishCounts.join(", ")}`);
  console.log(`Reading passage word counts: ${readingCounts.join(", ")}`);
  assert.deepEqual(problems,[],`Passage fidelity problems:\n${problems.join("\n")}`);
});

test("Science Data Representation sets expose one structured browser data display",()=>{
  const problems=[];
  for(const set of SCIENCE_SETS.filter(set=>set.format==="DR")){
    if(!set.supplement){ problems.push(`${set.id}: missing structured Data Representation supplement`); continue; }
    const tables=set.supplement.type==="tables" ? set.supplement.tables : [set.supplement];
    if(!tables.length) problems.push(`${set.id}: empty structured supplement`);
    for(const table of tables) validateTable(table,set.id,problems);
    if(!set.displayText || set.displayText===set.text) problems.push(`${set.id}: DR browser text must separate prose from structured data`);
    if(containsPipeTable(set.displayText)) problems.push(`${set.id}: DR browser text duplicates pipe-delimited table data`);
  }
  assert.deepEqual(problems,[],`Science display problems:\n${problems.join("\n")}`);
});
