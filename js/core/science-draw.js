import { shuffle } from "./random.js";
import { shuffleQuestionChoices, countBy } from "./draw.js";

function sample(pool,count,rng){
  const candidates=shuffle(pool,rng);
  if(candidates.length<count) throw new Error(`Insufficient Science sets: need ${count}, have ${candidates.length}`);
  return candidates.slice(0,count);
}

function attachScienceSet(set,scored,rng){
  return set.questions.map((q,index)=>shuffleQuestionChoices({
    ...q,
    scored,
    passageId:set.id,
    passageTitle:set.title,
    passageText:set.text,
    passageGenre:set.domain,
    passageFormat:set.format,
    passageQuestionNumber:index+1,
    passageQuestionCount:set.questions.length,
  },rng));
}

function withinCategoryRanges(questions,blueprint){
  const counts=countBy(questions,q=>q.category);
  return Object.entries(blueprint).every(([category,[min,max]])=>{
    const n=counts[category]||0;
    return n>=min && n<=max;
  });
}

function exactCounts(items,keyFn,expected){
  const counts=countBy(items,keyFn);
  return Object.entries(expected).every(([key,value])=>(counts[key]||0)===value);
}

function exactFormatItemTotals(sets,expected){
  const totals={};
  for(const set of sets) totals[set.format]=(totals[set.format]||0)+set.questions.length;
  return Object.entries(expected).every(([key,value])=>(totals[key]||0)===value);
}

export function drawScienceSection(sets,sectionConfig,rng=Math.random){
  const eligible=sets.filter(s=>Array.isArray(s.questions) && s.questions.length>=5 && s.questions.length<=6);
  const formatBlueprint=sectionConfig.operationalFormatBlueprint;
  let operationalSets=null;

  // Randomized constrained search scales better than enumerating every six-set combination as the bank grows.
  for(let attempt=0;attempt<2000 && !operationalSets;attempt++){
    const candidate=[];
    const used=new Set();
    for(const [format,count] of Object.entries(formatBlueprint)){
      const pool=eligible.filter(s=>s.format===format && !used.has(s.id));
      let chosen;
      try { chosen=sample(pool,count,rng); } catch { candidate.length=0; break; }
      for(const set of chosen){ used.add(set.id); candidate.push(set); }
    }
    if(candidate.length!==6) continue;
    if(!exactCounts(candidate,s=>s.domain,sectionConfig.operationalDomainBlueprint)) continue;
    if(!exactFormatItemTotals(candidate,sectionConfig.operationalFormatItemTotals)) continue;
    const questions=candidate.flatMap(s=>s.questions);
    if(questions.length!==sectionConfig.scoredItems) continue;
    if(!withinCategoryRanges(questions,sectionConfig.operationalBlueprint)) continue;
    operationalSets=candidate;
  }

  if(!operationalSets) throw new Error("No valid Science operational set combination available");
  const usedIds=new Set(operationalSets.map(s=>s.id));
  const fieldPool=eligible.filter(s=>!usedIds.has(s.id) && s.questions.length===sectionConfig.fieldTestItems);
  if(!fieldPool.length) throw new Error("No six-item Science field-test set available");
  const fieldSet=sample(fieldPool,1,rng)[0];

  const operationalQuestions=operationalSets.flatMap(s=>attachScienceSet(s,true,rng));
  const categoryCounts=countBy(operationalQuestions,q=>q.category);
  for(const [category,[min,max]] of Object.entries(sectionConfig.operationalBlueprint)){
    const n=categoryCounts[category]||0;
    if(n<min || n>max) throw new Error(`${category} count ${n} is outside ${min}-${max}`);
  }

  const orderedSets=shuffle([
    ...operationalSets.map(set=>({set,scored:true})),
    {set:fieldSet,scored:false},
  ],rng);
  const result=orderedSets.flatMap(({set,scored})=>attachScienceSet(set,scored,rng));
  if(result.length!==sectionConfig.totalItems) throw new Error(`Science draw has ${result.length}; expected ${sectionConfig.totalItems}`);
  if(new Set(orderedSets.map(x=>x.set.id)).size!==7) throw new Error("Science set reused within section");
  return result;
}
