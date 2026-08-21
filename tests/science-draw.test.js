import test from "node:test";
import assert from "node:assert/strict";
import { SCIENCE_SETS } from "../data/science.js";
import { SECTIONS } from "../js/config.js";
import { drawScienceSection } from "../js/core/science-draw.js";
import { countBy } from "../js/core/draw.js";
import { mulberry32 } from "../js/core/random.js";

const validCategories=new Set(["IOD","SIN","EAM"]);
const validFormats=new Set(["DR","RS","CV"]);
const validDomains=new Set(["life","earth","physics","chemistry"]);

function assertRange(value,[min,max],label){
  assert(value>=min && value<=max,`${label} ${value} is outside ${min}-${max}`);
}

test("draft Science bank has seven complete original sets and forty questions",()=>{
  assert.equal(SCIENCE_SETS.length,7);
  const ids=new Set(), questionIds=new Set();
  let total=0;
  for(const set of SCIENCE_SETS){
    assert(!ids.has(set.id)); ids.add(set.id);
    assert(validFormats.has(set.format)); assert(validDomains.has(set.domain));
    if(set.engineeringDesign!==undefined) assert.equal(typeof set.engineeringDesign,"boolean");
    assert(set.text.length>150,`${set.id} stimulus is unexpectedly short`);
    assert([5,6,7].includes(set.questions.length));
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

test("500 Science draws satisfy final enhanced ACT passage, content-area, category, and knowledge ranges",()=>{
  for(let seed=1;seed<=500;seed++){
    const draw=drawScienceSection(SCIENCE_SETS,SECTIONS.science,mulberry32(seed));
    assert.equal(draw.length,40);
    const scored=draw.filter(q=>q.scored), field=draw.filter(q=>!q.scored);
    assert.equal(scored.length,34); assert.equal(field.length,6);

    const categoryCounts=countBy(scored,q=>q.category);
    for(const [category,range] of Object.entries(SECTIONS.science.operationalBlueprint)){
      assertRange(categoryCounts[category]||0,range,category);
    }
    assertRange(scored.filter(q=>q.backgroundKnowledge).length,SECTIONS.science.backgroundKnowledgeRange,"background knowledge");

    const opIds=[...new Set(scored.map(q=>q.passageId))];
    assert.equal(opIds.length,6);
    const ops=opIds.map(id=>SCIENCE_SETS.find(s=>s.id===id));
    assert.deepEqual(countBy(ops,s=>s.format),{DR:2,RS:3,CV:1});

    const contentCounts=countBy(ops,s=>s.domain);
    for(const [domain,range] of Object.entries(SECTIONS.science.operationalContentAreaBlueprint)){
      assertRange(contentCounts[domain]||0,range,domain);
    }
    assertRange(ops.filter(s=>s.engineeringDesign).length,SECTIONS.science.engineeringDesignPassageRange,"engineering/design passages");

    const formatItems=countBy(scored,q=>q.passageFormat);
    for(const [format,range] of Object.entries(SECTIONS.science.operationalFormatItemRanges)){
      assertRange(formatItems[format]||0,range,`${format} items`);
    }

    const allIds=[...new Set(draw.map(q=>q.passageId))];
    assert.equal(allIds.length,7);
    assert.equal(new Set(field.map(q=>q.passageId)).size,1);
    const allSets=allIds.map(id=>SCIENCE_SETS.find(s=>s.id===id));
    const allContentCounts=countBy(allSets,s=>s.domain);
    for(const [domain,max] of Object.entries(SECTIONS.science.totalContentAreaMaxWithFieldTest)){
      assert((allContentCounts[domain]||0)<=max,`${domain} exceeds all-passage maximum ${max}`);
    }
  }
});
