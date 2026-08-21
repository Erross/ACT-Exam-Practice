import test from "node:test";
import assert from "node:assert/strict";
import { SECTIONS } from "../js/config.js";
import { drawScienceSection } from "../js/core/science-draw.js";
import { countBy } from "../js/core/draw.js";
import { mulberry32 } from "../js/core/random.js";

const DR_CATS=["IOD","IOD","IOD","SIN","EAM"];
const RS_CATS=["IOD","IOD","SIN","SIN","EAM","EAM"];
const CV_CATS=["IOD","SIN","EAM","EAM","EAM","EAM"];

function makeSet(id,format,domain,categories){
  return {id,title:`Science ${id}`,format,domain,text:`Original fixture stimulus for ${id}.`,questions:categories.map((category,i)=>({
    id:`${id}-Q${i+1}`,section:"science",category,stem:`Science question ${i+1}`,
    choices:["Choice one","Choice two","Choice three","Choice four"],correct:"A",
    rationale:"Fixture rationale is long enough to validate the constrained Science draw."
  }))};
}

const SETS=[
  makeSet("SDR-LIFE","DR","life",DR_CATS),
  makeSet("SDR-EARTH","DR","earth",DR_CATS),
  makeSet("SRS-LIFE","RS","life",RS_CATS),
  makeSet("SRS-PHYS","RS","physics",RS_CATS),
  makeSet("SRS-CHEM","RS","chemistry",RS_CATS),
  makeSet("SCV-ENG","CV","engineering",CV_CATS),
  makeSet("SFT-EARTH","RS","earth",RS_CATS),
];

test("500 Science draws satisfy final enhanced passage, domain, and category blueprint",()=>{
  for(let seed=1;seed<=500;seed++){
    const draw=drawScienceSection(SETS,SECTIONS.science,mulberry32(seed));
    assert.equal(draw.length,40);
    const scored=draw.filter(q=>q.scored), field=draw.filter(q=>!q.scored);
    assert.equal(scored.length,34); assert.equal(field.length,6);
    assert.deepEqual(countBy(scored,q=>q.category),{IOD:13,SIN:9,EAM:12});

    const opIds=[...new Set(scored.map(q=>q.passageId))];
    assert.equal(opIds.length,6);
    const ops=opIds.map(id=>SETS.find(s=>s.id===id));
    assert.deepEqual(countBy(ops,s=>s.format),{DR:2,RS:3,CV:1});
    assert.deepEqual(countBy(ops,s=>s.domain),{life:2,earth:1,physics:1,chemistry:1,engineering:1});

    const formatItems=countBy(scored,q=>q.passageFormat);
    assert.deepEqual(formatItems,{DR:10,RS:18,CV:6});
    const allIds=[...new Set(draw.map(q=>q.passageId))];
    assert.equal(allIds.length,7);
    assert.equal(new Set(field.map(q=>q.passageId)).size,1);
  }
});
