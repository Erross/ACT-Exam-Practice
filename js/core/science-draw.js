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
    passageText:set.displayText || set.text,
    passageGenre:set.domain,
    passageFormat:set.format,
    passageSupplement:set.supplement || null,
    passageEngineeringDesign:Boolean(set.engineeringDesign),
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

function withinCountRanges(items,keyFn,blueprint){
  const counts=countBy(items,keyFn);
  return Object.entries(blueprint).every(([key,[min,max]])=>{
    const n=counts[key]||0;
    return n>=min && n<=max;
  });
}

function withinBackgroundKnowledgeRange(questions,range){
  const n=questions.filter(q=>q.backgroundKnowledge).length;
  return n>=range[0] && n<=range[1];
}

function withinFormatItemRanges(sets,ranges){
  const totals={};
  for(const set of sets) totals[set.format]=(totals[set.format]||0)+set.questions.length;
  return Object.entries(ranges).every(([key,[min,max]])=>{
    const n=totals[key]||0;
    return n>=min && n<=max;
  });
}

function withinEngineeringDesignRange(sets,range){
  const n=sets.filter(set=>set.engineeringDesign).length;
  return n>=range[0] && n<=range[1];
}

function withinTotalContentAreaMax(sets,maxima){
  const counts=countBy(sets,set=>set.domain);
  return Object.entries(maxima).every(([domain,max])=>(counts[domain]||0)<=max);
}

export function drawScienceSection(sets,sectionConfig,rng=Math.random){
  const eligible=sets.filter(s=>Array.isArray(s.questions) && s.questions.length>=5 && s.questions.length<=7);
  const formatBlueprint=sectionConfig.operationalFormatBlueprint;
  let operationalSets=null;

  // Randomized constrained search scales better than enumerating every six-set combination as the bank grows.
  for(let attempt=0;attempt<4000 && !operationalSets;attempt++){
    const candidate=[];
    const used=new Set();
    for(const [format,count] of Object.entries(formatBlueprint)){
      const pool=eligible.filter(s=>s.format===format && !used.has(s.id));
      let chosen;
      try { chosen=sample(pool,count,rng); } catch { candidate.length=0; break; }
      for(const set of chosen){ used.add(set.id); candidate.push(set); }
    }
    if(candidate.length!==6) continue;
    if(!withinCountRanges(candidate,s=>s.domain,sectionConfig.operationalContentAreaBlueprint)) continue;
    if(!withinFormatItemRanges(candidate,sectionConfig.operationalFormatItemRanges)) continue;
    if(!withinEngineeringDesignRange(candidate,sectionConfig.engineeringDesignPassageRange)) continue;
    const questions=candidate.flatMap(s=>s.questions);
    if(questions.length!==sectionConfig.scoredItems) continue;
    if(!withinCategoryRanges(questions,sectionConfig.operationalBlueprint)) continue;
    if(!withinBackgroundKnowledgeRange(questions,sectionConfig.backgroundKnowledgeRange)) continue;
    operationalSets=candidate;
  }

  if(!operationalSets) throw new Error("No valid Science operational set combination available");
  const usedIds=new Set(operationalSets.map(s=>s.id));
  const fieldPool=eligible.filter(set=>{
    if(usedIds.has(set.id) || set.questions.length!==sectionConfig.fieldTestItems) return false;
    return withinTotalContentAreaMax(
      [...operationalSets,set],
      sectionConfig.totalContentAreaMaxWithFieldTest,
    );
  });
  if(!fieldPool.length) throw new Error("No six-item Science field-test set satisfies content-area maxima");
  const fieldSet=sample(fieldPool,1,rng)[0];

  const operationalQuestions=operationalSets.flatMap(s=>attachScienceSet(s,true,rng));
  const categoryCounts=countBy(operationalQuestions,q=>q.category);
  for(const [category,[min,max]] of Object.entries(sectionConfig.operationalBlueprint)){
    const n=categoryCounts[category]||0;
    if(n<min || n>max) throw new Error(`${category} count ${n} is outside ${min}-${max}`);
  }
  if(!withinBackgroundKnowledgeRange(operationalQuestions,sectionConfig.backgroundKnowledgeRange)){
    throw new Error("Science background-knowledge count is outside blueprint range");
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
