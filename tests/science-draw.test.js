import test from "node:test";
import assert from "node:assert/strict";
import { SCIENCE_SETS } from "../data/science.js";
import { SECTIONS } from "../js/config.js";
import { drawScienceSection } from "../js/core/science-draw.js";
import { countBy } from "../js/core/draw.js";
import { mulberry32 } from "../js/core/random.js";

const validCategories=new Set(["IOD","SIN","EAM"]);
const validFormats=new Set(["DR","RS","CV"]);
const validDomains=new Set(["life","earth","physics","chemistry","engineering"]);

test("draft Science bank has seven complete original sets and forty questions",()=>{
  assert.equal(SCIENCE_SETS.length,7);
  const ids=new Set(), questionIds=new Set();
  let total=0;
  for(const set of SCIENCE_SETS){
    assert(!ids.has(set.id)); ids.add(set.id);
    assert(validFormats.has(set.format)); assert(validDomains.has(set.domain));
    assert(set.text.length>150,`${set.id} stimulus is unexpectedly short`);
    assert([5,6].includes(set.questions.length));
    total+=set.questions.length;
    for(const q of set.questions){
      assert(!questionIds.has(q.id)); questionIds.add(q.id);
      assert(validCategories.has(q.category));
      assert.equal(q.choices.length,4); assert.equal(new Set(q.choices).size,4);
      assert.match(q.correct,/^[ABCD]$/); assert(q.rationale.length>=20);
    }
  }
  assert.equal(total,40); assert.equal(questionIds.size,40);
});

test("500 Science draws satisfy final enhanced passage, domain, category, and background-knowledge blueprint",()=>{
  for(let seed=1;seed<=500;seed++){
    const draw=drawScienceSection(SCIENCE_SETS,SECTIONS.science,mulberry32(seed));
    assert.equal(draw.length,40);
    const scored=draw.filter(q=>q.scored), field=draw.filter(q=>!q.scored);
    assert.equal(scored.length,34); assert.equal(field.length,6);
    assert.deepEqual(countBy(scored,q=>q.category),{IOD:13,SIN:9,EAM:12});
    assert.equal(scored.filter(q=>q.backgroundKnowledge).length,6);

    const opIds=[...new Set(scored.map(q=>q.passageId))];
    assert.equal(opIds.length,6);
    const ops=opIds.map(id=>SCIENCE_SETS.find(s=>s.id===id));
    assert.deepEqual(countBy(ops,s=>s.format),{DR:2,RS:3,CV:1});
    assert.deepEqual(countBy(ops,s=>s.domain),{life:2,earth:1,physics:1,chemistry:1,engineering:1});

    const formatItems=countBy(scored,q=>q.passageFormat);
    assert.deepEqual(formatItems,{DR:10,RS:18,CV:6});
    const allIds=[...new Set(draw.map(q=>q.passageId))];
    assert.equal(allIds.length,7);
    assert.equal(new Set(field.map(q=>q.passageId)).size,1);
  }
});
