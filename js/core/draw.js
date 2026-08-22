import { shuffle } from "./random.js";

function assertUniqueFamilies(items) {
  const seen = new Set();
  for (const q of items) {
    const family = q.variantGroup || q.id;
    if (seen.has(family)) return false;
    seen.add(family);
  }
  return true;
}

export function shuffleQuestionChoices(question, rng = Math.random) {
  const sourceIndex = "ABCD".indexOf(question.correct);
  if (sourceIndex < 0 || question.choices.length !== 4) throw new Error(`Invalid answer key for ${question.id}`);
  const correctText = question.choices[sourceIndex];
  const choices = shuffle(question.choices, rng);
  const correctIndex = choices.indexOf(correctText);
  if (correctIndex < 0) throw new Error(`Lost semantic answer while shuffling ${question.id}`);
  return { ...question, choices, correct: "ABCD"[correctIndex] };
}

function sampleAvoidingFamilies(pool, count, usedFamilies, rng) {
  const candidates = shuffle(pool, rng);
  const picked = [];
  for (const q of candidates) {
    const family = q.variantGroup || q.id;
    if (usedFamilies.has(family)) continue;
    usedFamilies.add(family);
    picked.push(q);
    if (picked.length === count) return picked;
  }
  throw new Error(`Insufficient distinct variant families for requested draw of ${count}`);
}

export function drawMathSection(bank, sectionConfig, rng = Math.random) {
  const usedFamilies = new Set();
  const operational = [];
  const quotas = sectionConfig.operationalBlueprint;
  for (const [category, count] of Object.entries(quotas)) {
    const pool = bank.filter(q => q.category === category);
    operational.push(...sampleAvoidingFamilies(pool, count, usedFamilies, rng));
  }
  if (operational.length !== sectionConfig.scoredItems) {
    throw new Error(`Operational draw has ${operational.length}; expected ${sectionConfig.scoredItems}`);
  }
  let modeling = operational.filter(q => q.modeling).length;
  if (modeling < sectionConfig.modelingMinimum) {
    const nonModel = operational.filter(q => !q.modeling);
    const replacements = bank.filter(q => q.modeling && !usedFamilies.has(q.variantGroup || q.id));
    while (modeling < sectionConfig.modelingMinimum && nonModel.length && replacements.length) {
      const outgoing = nonModel.pop();
      const idx = operational.indexOf(outgoing);
      const sameCategory = replacements.findIndex(q => q.category === outgoing.category);
      if (sameCategory < 0) continue;
      const incoming = replacements.splice(sameCategory, 1)[0];
      usedFamilies.delete(outgoing.variantGroup || outgoing.id);
      usedFamilies.add(incoming.variantGroup || incoming.id);
      operational[idx] = incoming;
      modeling++;
    }
  }
  if (modeling < sectionConfig.modelingMinimum) throw new Error("Unable to satisfy modeling minimum");

  const remaining = bank.filter(q => !operational.some(x => x.id === q.id));
  const fieldTests = sampleAvoidingFamilies(remaining, sectionConfig.fieldTestItems, usedFamilies, rng);
  const combined = [
    ...operational.map(q => ({ ...q, scored: true })),
    ...fieldTests.map(q => ({ ...q, scored: false })),
  ].map(q => shuffleQuestionChoices(q, rng));

  const rank=new Map(sectionConfig.difficultyOrder.map((name,index)=>[name,index]));
  for(const q of combined){
    if(!rank.has(q.difficulty)) throw new Error(`Invalid Math difficulty ${q.difficulty} for ${q.id}`);
  }
  // ACT's final enhanced framework specifies increasing difficulty across the displayed Math section.
  // Shuffle first so items within the same calibrated tier still vary across attempts, then use a stable tier sort.
  const result = shuffle(combined,rng).sort((a,b)=>rank.get(a.difficulty)-rank.get(b.difficulty));
  if (result.length !== sectionConfig.totalItems || !assertUniqueFamilies(result)) {
    throw new Error("Invalid final section draw");
  }
  return result;
}

function pickPassages(pool, count, usedIds, rng) {
  const candidates = shuffle(pool.filter(p => !usedIds.has(p.id)), rng);
  if (candidates.length < count) throw new Error(`Insufficient passage sets for requested draw of ${count}`);
  const picked = candidates.slice(0, count);
  for (const p of picked) usedIds.add(p.id);
  return picked;
}

function attachPassage(passage, scored, rng) {
  return passage.questions.map((q, index) => shuffleQuestionChoices({
    ...q,
    scored,
    passageId: passage.id,
    passageTitle: passage.title,
    passageText: passage.displayText || passage.text,
    passageLength: passage.length,
    passageGenre: passage.genre,
    passageWritingType: passage.writingType || null,
    passageDomain: passage.domain || null,
    passageFormat: passage.format || "single",
    passageSupplement: passage.supplement || null,
    passageQuestionNumber: index + 1,
    passageQuestionCount: passage.questions.length,
  }, rng));
}

function assertRangeBlueprint(items, blueprint) {
  const counts = countBy(items, q => q.category);
  for (const [category, range] of Object.entries(blueprint)) {
    const value = counts[category] || 0;
    const [min, max] = range;
    if (value < min || value > max) {
      throw new Error(`${category} count ${value} is outside ${min}-${max}`);
    }
  }
}

function combinations(items,count){
  const out=[];
  const walk=(start,picked)=>{
    if(picked.length===count){ out.push([...picked]); return; }
    const needed=count-picked.length;
    for(let i=start;i<=items.length-needed;i++){
      picked.push(items[i]);
      walk(i+1,picked);
      picked.pop();
    }
  };
  walk(0,[]);
  return out;
}

function isValidEnglishOperationalSet(passages,sectionConfig){
  if(passages.length!==5) return false;
  const lengthCounts=countBy(passages,p=>p.length);
  for(const [length,expected] of Object.entries(sectionConfig.operationalPassageLengthBlueprint)){
    if((lengthCounts[length]||0)!==expected) return false;
  }
  const typeCounts=countBy(passages,p=>p.writingType);
  for(const [type,[min,max]] of Object.entries(sectionConfig.operationalWritingTypeBlueprint)){
    const value=typeCounts[type]||0;
    if(value<min || value>max) return false;
  }
  const domainCounts=countBy(passages,p=>p.domain);
  if(Object.values(domainCounts).some(value=>value>sectionConfig.operationalDomainMax)) return false;
  const questions=passages.flatMap(p=>p.questions);
  if(questions.length!==sectionConfig.scoredItems) return false;
  try { assertRangeBlueprint(questions,sectionConfig.operationalBlueprint); } catch { return false; }
  return true;
}

export function drawEnglishSection(passages, sectionConfig, rng = Math.random) {
  const longs = passages.filter(p => p.length === "long" && p.questions.length === 10);
  const shorts = passages.filter(p => p.length === "short" && p.questions.length === 5);
  const validForms=[];
  for(const longSet of combinations(longs,sectionConfig.operationalPassageLengthBlueprint.long)){
    for(const shortSet of combinations(shorts,sectionConfig.operationalPassageLengthBlueprint.short)){
      const candidate=[...longSet,...shortSet];
      if(isValidEnglishOperationalSet(candidate,sectionConfig)) validForms.push(candidate);
    }
  }
  if(!validForms.length) throw new Error("No valid English operational passage combination available");
  const operationalPassages=shuffle(validForms,rng)[0];
  const usedIds=new Set(operationalPassages.map(p=>p.id));
  const operational = operationalPassages.flatMap(p => attachPassage(p, true, rng));
  if (operational.length !== sectionConfig.scoredItems) {
    throw new Error(`English operational draw has ${operational.length}; expected ${sectionConfig.scoredItems}`);
  }
  assertRangeBlueprint(operational, sectionConfig.operationalBlueprint);

  const remainingLongs = longs.filter(p => !usedIds.has(p.id));
  const remainingShorts = shorts.filter(p => !usedIds.has(p.id));
  const canLong = remainingLongs.length >= 1;
  const canShort = remainingShorts.length >= 2;
  if (!canLong && !canShort) throw new Error("Insufficient English passages for embedded field-test set");

  const useLongFieldTest = canLong && (!canShort || rng() < 0.5);
  const fieldPassages = useLongFieldTest
    ? pickPassages(remainingLongs, 1, usedIds, rng)
    : pickPassages(remainingShorts, 2, usedIds, rng);

  const sets = shuffle([
    ...operationalPassages.map(p => ({ passage: p, scored: true })),
    ...fieldPassages.map(p => ({ passage: p, scored: false })),
  ], rng);
  const result = sets.flatMap(({ passage, scored }) => attachPassage(passage, scored, rng));
  if (result.length !== sectionConfig.totalItems) throw new Error("Invalid English final section draw");
  if (new Set(sets.map(s => s.passage.id)).size !== sets.length) throw new Error("English passage reused within section");
  return result;
}

function isValidReadingOperationalSet(passages, sectionConfig) {
  if(passages.length!==3 || passages.some(p=>p.questions.length!==9)) return false;
  const genre=countBy(passages,p=>p.genre);
  for(const [name,expected] of Object.entries(sectionConfig.operationalGenreBlueprint)){
    if((genre[name]||0)!==expected) return false;
  }
  const format=countBy(passages,p=>p.format||"single");
  if((format.single||0)!==sectionConfig.operationalFormatBlueprint.single) return false;
  if(((format.paired||0)+(format.vqi||0))!==sectionConfig.operationalFormatBlueprint.multi) return false;
  const length=countBy(passages,p=>String(p.length));
  for(const [name,expected] of Object.entries(sectionConfig.operationalLengthBlueprint)){
    if((length[name]||0)!==expected) return false;
  }
  const questions=passages.flatMap(p=>p.questions);
  try { assertRangeBlueprint(questions,sectionConfig.operationalBlueprint); } catch { return false; }
  return true;
}

export function drawReadingSection(passages, sectionConfig, rng = Math.random) {
  const eligible=passages.filter(p=>p.questions.length===9);
  const validForms=combinations(eligible,3).filter(combo=>isValidReadingOperationalSet(combo,sectionConfig));
  if(!validForms.length) throw new Error("No valid Reading operational passage combination available");
  const operationalPassages=shuffle(validForms,rng)[0];
  const used=new Set(operationalPassages.map(p=>p.id));
  const operationalFormats=countBy(operationalPassages,p=>p.format||"single");
  const fieldPool=eligible.filter(p=>{
    if(used.has(p.id)) return false;
    const format=p.format||"single";
    if(format==="paired" && (operationalFormats.paired||0)>=1) return false;
    if(format==="vqi" && (operationalFormats.vqi||0)>=1) return false;
    return true;
  });
  if(!fieldPool.length) throw new Error("No Reading field-test passage available without duplicating a paired or VQI unit");
  const fieldPassage=shuffle(fieldPool,rng)[0];
  const operational=operationalPassages.flatMap(p=>attachPassage(p,true,rng));
  if(operational.length!==sectionConfig.scoredItems) throw new Error("Invalid Reading operational item count");
  assertRangeBlueprint(operational,sectionConfig.operationalBlueprint);
  const sets=shuffle([
    ...operationalPassages.map(p=>({passage:p,scored:true})),
    {passage:fieldPassage,scored:false},
  ],rng);
  const result=sets.flatMap(({passage,scored})=>attachPassage(passage,scored,rng));
  if(result.length!==sectionConfig.totalItems) throw new Error("Invalid Reading final section draw");
  if(new Set(sets.map(s=>s.passage.id)).size!==4) throw new Error("Reading passage reused within section");
  return result;
}

export function countBy(items, keyFn) {
  return items.reduce((acc, item) => {
    const key = keyFn(item);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}
