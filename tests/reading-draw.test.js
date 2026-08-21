import test from "node:test";
import assert from "node:assert/strict";
import { SECTIONS } from "../js/config.js";
import { drawReadingSection, countBy } from "../js/core/draw.js";
import { mulberry32 } from "../js/core/random.js";

function makePassage(id,genre,format,length){
  const cats=["KID","KID","KID","KID","CS","CS","CS","IKI","IKI"];
  return {id,title:`Reading ${id}`,genre,format,length,text:`Fixture passage ${id}.`,questions:cats.map((category,i)=>({
    id:`${id}-Q${i+1}`,section:"reading",category,stem:`Question ${i+1}`,
    choices:["A","B","C","D"],correct:"A",rationale:"Fixture rationale long enough for reading draw validation."
  }))};
}

const PASSAGES=[
  makePassage("RL1","literary","single",750),
  makePassage("RL2","literary","single",750),
  makePassage("RI1","informational","single",750),
  makePassage("RI2","informational","single",750),
  makePassage("RP1","informational","paired",650),
  makePassage("RP2","informational","paired",650),
  makePassage("RV1","informational","vqi",650),
  makePassage("RF1","informational","single",750),
];

test("500 Reading draws satisfy final enhanced passage and category blueprint",()=>{
  for(let seed=1;seed<=500;seed++){
    const draw=drawReadingSection(PASSAGES,SECTIONS.reading,mulberry32(seed));
    assert.equal(draw.length,36);
    const scored=draw.filter(q=>q.scored), field=draw.filter(q=>!q.scored);
    assert.equal(scored.length,27); assert.equal(field.length,9);
    assert.deepEqual(countBy(scored,q=>q.category),{KID:12,CS:9,IKI:6});

    const opIds=[...new Set(scored.map(q=>q.passageId))];
    assert.equal(opIds.length,3);
    const ops=opIds.map(id=>PASSAGES.find(p=>p.id===id));
    assert.deepEqual(countBy(ops,p=>p.genre),{literary:1,informational:2});
    const formats=countBy(ops,p=>p.format);
    assert.equal(formats.single,2); assert.equal((formats.paired||0)+(formats.vqi||0),1);
    assert.deepEqual(countBy(ops,p=>String(p.length)),{"650":1,"750":2});

    const allIds=[...new Set(draw.map(q=>q.passageId))];
    assert.equal(allIds.length,4);
    for(const id of allIds){
      const rows=draw.filter(q=>q.passageId===id);
      assert.equal(rows.length,9);
      assert(rows.every(q=>q.scored===rows[0].scored));
    }
  }
});
