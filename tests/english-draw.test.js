import test from "node:test";
import assert from "node:assert/strict";
import { SECTIONS } from "../js/config.js";
import { drawEnglishSection, countBy } from "../js/core/draw.js";
import { mulberry32 } from "../js/core/random.js";

function makePassage(id, length, writingType, domain) {
  const count = length === "long" ? 10 : 5;
  const categories = length === "long"
    ? ["POW","POW","POW","POW","KLA","KLA","CSE","CSE","CSE","CSE"]
    : ["POW","POW","KLA","CSE","CSE"];
  return {
    id,
    title: `Passage ${id}`,
    text: `Original test fixture text for ${id}.`,
    length,
    genre:writingType,
    writingType,
    domain,
    questions: Array.from({ length: count }, (_, i) => ({
      id: `${id}-Q${i+1}`,
      section: "english",
      category: categories[i],
      stem: `Question ${i+1}`,
      choices: ["A","B","C","D"],
      correct: "A",
      rationale: "Fixture rationale long enough for the schema.",
    })),
  };
}

const PASSAGES = [
  makePassage("L1","long","informational","SSC"),
  makePassage("L2","long","narrative","NSC"),
  makePassage("L3","long","argumentative","NSC"),
  makePassage("L4","long","informational","HUM"),
  makePassage("L5","long","informational","HUM"),
  makePassage("L6","long","informational","SSC"),
  makePassage("S1","short","informational","NSC"),
  makePassage("S2","short","argumentative","SSC"),
  makePassage("S3","short","narrative","HUM"),
  makePassage("S4","short","informational","NSC"),
  makePassage("S5","short","argumentative","NSC"),
  makePassage("S6","short","informational","SSC"),
];

test("500 English draws preserve passage sets and final enhanced blueprint",()=>{
  for(let seed=1; seed<=500; seed++) {
    const draw=drawEnglishSection(PASSAGES,SECTIONS.english,mulberry32(seed));
    assert.equal(draw.length,50);
    const scored=draw.filter(q=>q.scored);
    const field=draw.filter(q=>!q.scored);
    assert.equal(scored.length,40);
    assert.equal(field.length,10);
    const counts=countBy(scored,q=>q.category);
    assert.deepEqual(counts,{POW:16,KLA:8,CSE:16});

    const passageIds=[...new Set(draw.map(q=>q.passageId))];
    const operationalIds=[...new Set(scored.map(q=>q.passageId))];
    assert.equal(operationalIds.length,5);
    const operationalPassages=operationalIds.map(id=>PASSAGES.find(p=>p.id===id));
    assert.deepEqual(countBy(operationalPassages,p=>p.length),{long:3,short:2});
    const writingTypes=countBy(operationalPassages,p=>p.writingType);
    assert.equal(writingTypes.narrative,1);
    assert((writingTypes.informational||0)>=2 && (writingTypes.informational||0)<=3);
    assert((writingTypes.argumentative||0)>=1 && (writingTypes.argumentative||0)<=2);
    const domains=countBy(operationalPassages,p=>p.domain);
    assert(Object.values(domains).every(n=>n<=2),JSON.stringify(domains));
    assert(scored.every(q=>q.passageWritingType && q.passageDomain));
    assert(passageIds.length===6 || passageIds.length===7);

    for(const id of passageIds) {
      const rows=draw.filter(q=>q.passageId===id);
      const source=PASSAGES.find(p=>p.id===id);
      assert.equal(rows.length,source.questions.length);
      assert(rows.every(q=>q.scored===rows[0].scored));
    }
  }
});
