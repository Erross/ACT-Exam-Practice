import test from "node:test";
import assert from "node:assert/strict";
import { READING_PASSAGES } from "../data/reading.js";
import { SECTIONS } from "../js/config.js";
import { drawReadingSection, countBy } from "../js/core/draw.js";
import { mulberry32 } from "../js/core/random.js";

const validCategories=new Set(["KID","CS","IKI"]);

test("draft Reading bank has six complete original passage sets",()=>{
  assert.equal(READING_PASSAGES.length,6);
  const ids=new Set(); const questionIds=new Set();
  for(const p of READING_PASSAGES){
    assert(!ids.has(p.id)); ids.add(p.id);
    assert.equal(p.questions.length,9);
    assert(["literary","informational"].includes(p.genre));
    assert(["single","paired","vqi"].includes(p.format));
    assert(["650","750"].includes(String(p.length)));
    assert(p.text.length>1200,`${p.id} passage text is unexpectedly short`);
    for(const q of p.questions){
      assert(!questionIds.has(q.id)); questionIds.add(q.id);
      assert(validCategories.has(q.category));
      assert.equal(q.choices.length,4);
      assert.equal(new Set(q.choices).size,4);
      assert.match(q.correct,/^[ABCD]$/);
      assert(q.rationale.length>=20);
    }
  }
  assert.equal(questionIds.size,54);
});

test("500 Reading draws satisfy final enhanced passage and category blueprint",()=>{
  for(let seed=1;seed<=500;seed++){
    const draw=drawReadingSection(READING_PASSAGES,SECTIONS.reading,mulberry32(seed));
    assert.equal(draw.length,36);
    const scored=draw.filter(q=>q.scored), field=draw.filter(q=>!q.scored);
    assert.equal(scored.length,27); assert.equal(field.length,9);
    assert.deepEqual(countBy(scored,q=>q.category),{KID:12,CS:9,IKI:6});

    const opIds=[...new Set(scored.map(q=>q.passageId))];
    assert.equal(opIds.length,3);
    const ops=opIds.map(id=>READING_PASSAGES.find(p=>p.id===id));
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
