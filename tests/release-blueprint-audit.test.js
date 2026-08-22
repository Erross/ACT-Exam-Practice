import test from "node:test";
import assert from "node:assert/strict";
import { SECTIONS } from "../js/config.js";
import { MATH_QUESTIONS } from "../data/math.js";
import { ENGLISH_PASSAGES } from "../data/english.js";
import { READING_PASSAGES } from "../data/reading.js";
import { SCIENCE_SETS } from "../data/science.js";
import { drawMathSection, drawEnglishSection, drawReadingSection, countBy } from "../js/core/draw.js";
import { drawScienceSection } from "../js/core/science-draw.js";
import { mulberry32 } from "../js/core/random.js";

const FORMS=5000;
const mathDifficultyRank=new Map(SECTIONS.math.difficultyOrder.map((name,index)=>[name,index]));

function assertRange(value,[min,max],label,seed){
  assert(value>=min && value<=max,`seed ${seed}: ${label} ${value} is outside ${min}-${max}`);
}

function setIds(questions){
  return [...new Set(questions.map(q=>q.passageId))];
}

test("5,000 production Math forms satisfy the final enhanced ACT blueprint",()=>{
  for(let seed=1;seed<=FORMS;seed++){
    const draw=drawMathSection(MATH_QUESTIONS,SECTIONS.math,mulberry32(0x10000000+seed));
    const scored=draw.filter(q=>q.scored), field=draw.filter(q=>!q.scored);
    assert.equal(draw.length,45,`seed ${seed}: Math displayed count`);
    assert.equal(scored.length,41,`seed ${seed}: Math scored count`);
    assert.equal(field.length,4,`seed ${seed}: Math EFT count`);
    assert.deepEqual(countBy(scored,q=>q.category),{NQ:5,A:7,F:8,G:8,S:5,IES:8},`seed ${seed}: Math reporting categories`);
    assert(scored.filter(q=>q.modeling).length>=SECTIONS.math.modelingMinimum,`seed ${seed}: Math modeling minimum`);
    assert.equal(new Set(draw.map(q=>q.variantGroup)).size,45,`seed ${seed}: Math variant-family reuse`);
    for(let i=1;i<draw.length;i++){
      assert(mathDifficultyRank.get(draw[i-1].difficulty)<=mathDifficultyRank.get(draw[i].difficulty),`seed ${seed}: Math difficulty order breaks between ${draw[i-1].id} and ${draw[i].id}`);
    }
  }
  console.log(`release evidence: ${FORMS.toLocaleString()} production Math forms satisfied count, EFT, reporting-category, modeling, variant-family, and difficulty-order constraints`);
});

test("5,000 production English forms satisfy the final enhanced ACT blueprint",()=>{
  const sourceById=new Map(ENGLISH_PASSAGES.map(p=>[p.id,p]));
  for(let seed=1;seed<=FORMS;seed++){
    const draw=drawEnglishSection(ENGLISH_PASSAGES,SECTIONS.english,mulberry32(0x20000000+seed));
    const scored=draw.filter(q=>q.scored), field=draw.filter(q=>!q.scored);
    assert.equal(draw.length,50,`seed ${seed}: English displayed count`);
    assert.equal(scored.length,40,`seed ${seed}: English scored count`);
    assert.equal(field.length,10,`seed ${seed}: English EFT count`);

    const categories=countBy(scored,q=>q.category);
    for(const [category,range] of Object.entries(SECTIONS.english.operationalBlueprint)){
      assertRange(categories[category]||0,range,`English ${category}`,seed);
    }

    const operationalIds=setIds(scored);
    assert.equal(operationalIds.length,5,`seed ${seed}: English operational passage count`);
    const operational=operationalIds.map(id=>sourceById.get(id));
    assert.deepEqual(countBy(operational,p=>p.length),{long:3,short:2},`seed ${seed}: English long/short mix`);
    const writingTypes=countBy(operational,p=>p.writingType);
    assertRange(writingTypes.informational||0,SECTIONS.english.operationalWritingTypeBlueprint.informational,"English informational passages",seed);
    assertRange(writingTypes.argumentative||0,SECTIONS.english.operationalWritingTypeBlueprint.argumentative,"English argumentative passages",seed);
    assertRange(writingTypes.narrative||0,SECTIONS.english.operationalWritingTypeBlueprint.narrative,"English narrative passages",seed);
    const domains=countBy(operational,p=>p.domain);
    assert(Object.values(domains).every(n=>n<=SECTIONS.english.operationalDomainMax),`seed ${seed}: English content-domain maximum ${JSON.stringify(domains)}`);

    for(const id of setIds(draw)){
      const rows=draw.filter(q=>q.passageId===id);
      const source=sourceById.get(id);
      assert(source,`seed ${seed}: unknown English passage ${id}`);
      assert.equal(rows.length,source.questions.length,`seed ${seed}: English passage ${id} was split`);
      assert(rows.every(q=>q.scored===rows[0].scored),`seed ${seed}: English passage ${id} mixes operational/EFT status`);
    }
  }
  console.log(`release evidence: ${FORMS.toLocaleString()} production English forms satisfied count, EFT, passage-length, writing-type, content-domain, category, and set-integrity constraints`);
});

test("5,000 production Reading forms satisfy the final enhanced ACT blueprint",()=>{
  const sourceById=new Map(READING_PASSAGES.map(p=>[p.id,p]));
  for(let seed=1;seed<=FORMS;seed++){
    const draw=drawReadingSection(READING_PASSAGES,SECTIONS.reading,mulberry32(0x30000000+seed));
    const scored=draw.filter(q=>q.scored), field=draw.filter(q=>!q.scored);
    assert.equal(draw.length,36,`seed ${seed}: Reading displayed count`);
    assert.equal(scored.length,27,`seed ${seed}: Reading scored count`);
    assert.equal(field.length,9,`seed ${seed}: Reading EFT count`);

    const categories=countBy(scored,q=>q.category);
    for(const [category,range] of Object.entries(SECTIONS.reading.operationalBlueprint)){
      assertRange(categories[category]||0,range,`Reading ${category}`,seed);
    }

    const operationalIds=setIds(scored);
    assert.equal(operationalIds.length,3,`seed ${seed}: Reading operational passage count`);
    const operational=operationalIds.map(id=>sourceById.get(id));
    assert.deepEqual(countBy(operational,p=>p.genre),{literary:1,informational:2},`seed ${seed}: Reading genre mix`);
    const formats=countBy(operational,p=>p.format);
    assert.equal(formats.single,2,`seed ${seed}: Reading single-passage count`);
    assert.equal((formats.paired||0)+(formats.vqi||0),1,`seed ${seed}: Reading paired/VQI operational count`);
    assert.deepEqual(countBy(operational,p=>String(p.length)),{"650":1,"750":2},`seed ${seed}: Reading length mix`);

    const allIds=setIds(draw);
    assert.equal(allIds.length,4,`seed ${seed}: Reading total passage count`);
    assert.equal(new Set(field.map(q=>q.passageId)).size,1,`seed ${seed}: Reading EFT is not one intact passage`);
    const allPassages=allIds.map(id=>sourceById.get(id));
    const allFormats=countBy(allPassages,p=>p.format);
    assert((allFormats.paired||0)<=1,`seed ${seed}: Reading contains two paired units`);
    assert((allFormats.vqi||0)<=1,`seed ${seed}: Reading contains two VQI units`);
    for(const id of allIds){
      const rows=draw.filter(q=>q.passageId===id);
      assert.equal(rows.length,9,`seed ${seed}: Reading passage ${id} was split`);
      assert(rows.every(q=>q.scored===rows[0].scored),`seed ${seed}: Reading passage ${id} mixes operational/EFT status`);
    }
  }
  console.log(`release evidence: ${FORMS.toLocaleString()} production Reading forms satisfied count, EFT, genre, single/paired/VQI, length, category, and set-integrity constraints`);
});

test("5,000 production Science forms satisfy the final enhanced ACT blueprint",()=>{
  const sourceById=new Map(SCIENCE_SETS.map(s=>[s.id,s]));
  for(let seed=1;seed<=FORMS;seed++){
    const draw=drawScienceSection(SCIENCE_SETS,SECTIONS.science,mulberry32(0x40000000+seed));
    const scored=draw.filter(q=>q.scored), field=draw.filter(q=>!q.scored);
    assert.equal(draw.length,40,`seed ${seed}: Science displayed count`);
    assert.equal(scored.length,34,`seed ${seed}: Science scored count`);
    assert.equal(field.length,6,`seed ${seed}: Science EFT count`);

    const categories=countBy(scored,q=>q.category);
    for(const [category,range] of Object.entries(SECTIONS.science.operationalBlueprint)){
      assertRange(categories[category]||0,range,`Science ${category}`,seed);
    }
    assertRange(scored.filter(q=>q.backgroundKnowledge).length,SECTIONS.science.backgroundKnowledgeRange,"Science background-knowledge items",seed);

    const operationalIds=setIds(scored);
    assert.equal(operationalIds.length,6,`seed ${seed}: Science operational set count`);
    const operational=operationalIds.map(id=>sourceById.get(id));
    assert.deepEqual(countBy(operational,s=>s.format),{DR:2,RS:3,CV:1},`seed ${seed}: Science format mix`);
    const content=countBy(operational,s=>s.domain);
    for(const [domain,range] of Object.entries(SECTIONS.science.operationalContentAreaBlueprint)){
      assertRange(content[domain]||0,range,`Science ${domain} passages`,seed);
    }
    assertRange(operational.filter(s=>s.engineeringDesign).length,SECTIONS.science.engineeringDesignPassageRange,"Science engineering/design passages",seed);
    const formatItems=countBy(scored,q=>q.passageFormat);
    for(const [format,range] of Object.entries(SECTIONS.science.operationalFormatItemRanges)){
      assertRange(formatItems[format]||0,range,`Science ${format} items`,seed);
    }

    const allIds=setIds(draw);
    assert.equal(allIds.length,7,`seed ${seed}: Science total set count`);
    assert.equal(new Set(field.map(q=>q.passageId)).size,1,`seed ${seed}: Science EFT is not one intact set`);
    const allSets=allIds.map(id=>sourceById.get(id));
    const allContent=countBy(allSets,s=>s.domain);
    for(const [domain,max] of Object.entries(SECTIONS.science.totalContentAreaMaxWithFieldTest)){
      assert((allContent[domain]||0)<=max,`seed ${seed}: Science ${domain} exceeds all-seven-set maximum ${max}`);
    }
    for(const id of allIds){
      const rows=draw.filter(q=>q.passageId===id);
      const source=sourceById.get(id);
      assert.equal(rows.length,source.questions.length,`seed ${seed}: Science set ${id} was split`);
      assert(rows.every(q=>q.scored===rows[0].scored),`seed ${seed}: Science set ${id} mixes operational/EFT status`);
    }
  }
  console.log(`release evidence: ${FORMS.toLocaleString()} production Science forms satisfied count, EFT, format, format-item, content-area, engineering/design, category, background-knowledge, all-seven-set maxima, and set-integrity constraints`);
});
