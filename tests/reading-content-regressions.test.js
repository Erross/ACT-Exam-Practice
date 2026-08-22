import test from "node:test";
import assert from "node:assert/strict";
import { READING_PASSAGES } from "../data/reading.js";

const passages=new Map(READING_PASSAGES.map(p=>[p.id,p]));
const questions=new Map(READING_PASSAGES.flatMap(p=>p.questions).map(q=>[q.id,q]));

test("Kiln weather comparison has one defensible rhetorical-function answer",()=>{
  const q=questions.get("R-LIT-KILN-6");
  assert(q,"missing R-LIT-KILN-6");
  const correct=q.choices["ABCD".indexOf(q.correct)];
  assert.match(correct,/new way of seeing|rather than treating/i);
  const distractors=q.choices.filter((_,i)=>i!=="ABCD".indexOf(q.correct)).join(" ");
  assert.doesNotMatch(distractors,/visually appealing on the finished bowls/i);
});

test("Noise passage length adjustment contributes meaningful conclusion text",()=>{
  const text=passages.get("R-INFO-NOISE")?.text || "";
  assert.match(text,/planners decide what to change and how to test the result\.$/);
  assert.doesNotMatch(text,/This distinction matters\.$/);
});
