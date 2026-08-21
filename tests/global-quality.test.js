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

function wordCount(text){
  const parts=String(text).trim().match(/[A-Za-z0-9]+(?:['’−-][A-Za-z0-9]+)*/g);
  return parts ? parts.length : 0;
}

function sectionBiasMetrics(questions){
  let uniqueLongest=0;
  let amongLongest=0;
  let correctWords=0;
  let distractorWords=0;
  const rawKeys={A:0,B:0,C:0,D:0};
  const absoluteStacked=[];
  const absolute=/\b(always|never|only|entirely|unlimited|impossible|guarantee(?:d|s)?|must)\b/i;

  for(const q of questions){
    const correctIndex="ABCD".indexOf(q.correct);
    const lengths=q.choices.map(wordCount);
    const longest=Math.max(...lengths);
    const correctLength=lengths[correctIndex];
    if(correctLength===longest) amongLongest++;
    if(correctLength===longest && lengths.filter(n=>n===longest).length===1) uniqueLongest++;
    correctWords+=correctLength;
    rawKeys[q.correct]++;

    const absoluteDistractors=[];
    q.choices.forEach((choice,index)=>{
      if(index===correctIndex) return;
      distractorWords+=lengths[index];
      if(absolute.test(String(choice))) absoluteDistractors.push("ABCD"[index]);
    });
    if(absoluteDistractors.length>=2) absoluteStacked.push(`${q.id} (${absoluteDistractors.join(",")})`);
  }

  const correctAverage=correctWords/questions.length;
  const distractorAverage=distractorWords/(questions.length*3);
  return {
    uniqueLongestRate:uniqueLongest/questions.length,
    amongLongestRate:amongLongest/questions.length,
    correctAverage,
    distractorAverage,
    relativeMeanDelta:Math.abs(correctAverage-distractorAverage)/Math.max(1e-9,distractorAverage),
    rawKeys,
    absoluteStacked,
  };
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
  assert.equal(total,451,"update this intentional bank-size checkpoint when adding reviewed content");
});

test("browser-effective banks satisfy mature release-style statistical-tell gates",()=>{
  const problems=[];
  for(const [section,questions] of Object.entries(BANKS)){
    const m=sectionBiasMetrics(questions);
    const shares=Object.fromEntries(Object.entries(m.rawKeys).map(([key,n])=>[key,n/questions.length]));
    console.log(`${section}: unique-longest ${(100*m.uniqueLongestRate).toFixed(1)}%; among-longest ${(100*m.amongLongestRate).toFixed(1)}%; correct ${m.correctAverage.toFixed(2)} words vs distractors ${m.distractorAverage.toFixed(2)} (${(100*m.relativeMeanDelta).toFixed(1)}% delta); keys ${JSON.stringify(m.rawKeys)}`);

    if(m.uniqueLongestRate>0.25) problems.push(`${section}: uniquely-longest correct ${(100*m.uniqueLongestRate).toFixed(1)}% > 25%`);
    // The AP-style "correct among longest" word-count gate is not meaningful for
    // ACT Math because most options are one-token numbers or expressions, so ties
    // dominate the statistic. Math still must pass unique-longest, mean-length
    // parity, raw-key balance, and absolute-language gates below.
    if(section!=="math" && m.amongLongestRate>0.58) problems.push(`${section}: correct among longest ${(100*m.amongLongestRate).toFixed(1)}% > 58%`);
    if(m.relativeMeanDelta>0.12) problems.push(`${section}: correct/distractor mean word-length delta ${(100*m.relativeMeanDelta).toFixed(1)}% > 12%`);
    for(const [key,share] of Object.entries(shares)){
      if(share<0.15 || share>0.35) problems.push(`${section}: raw key ${key} share ${(100*share).toFixed(1)}% outside 15-35%`);
    }
    if(m.absoluteStacked.length) problems.push(`${section}: multiple conspicuous absolute-language distractors in ${m.absoluteStacked.join("; ")}`);
  }
  assert.deepEqual(problems,[],`Statistical-tell problems:\n${problems.join("\n")}`);
});
