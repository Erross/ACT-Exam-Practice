import { estimateComposite } from "./scoring.js";

export function buildFullTestQueue(includeScience=false){
  return includeScience
    ? ["english","math","reading","science"]
    : ["english","math","reading"];
}

export function fullTestCommitment(sections,includeScience=false){
  const queue=buildFullTestQueue(includeScience);
  return queue.reduce((total,id)=>({
    questions:total.questions+sections[id].totalItems,
    minutes:total.minutes+sections[id].minutes,
  }),{questions:0,minutes:0});
}

export function fullTestTransition(completedId,nextId){
  if(completedId==="math" && nextId==="reading"){
    return {
      kind:"scheduled-break",
      heading:"Scheduled break after Mathematics",
      guidance:"For realistic standard-time practice, take up to 15 minutes before Reading. This practice app does not run a break timer; the Reading timer starts only when you begin the section.",
    };
  }
  if(completedId==="reading" && nextId==="science"){
    return {
      kind:"optional-transition",
      heading:"Optional Science is next",
      guidance:"Science is optional and is not part of the ACT Composite. Begin when you are ready; its 40-minute timer starts only when you begin the section.",
    };
  }
  return {
    kind:"section-transition",
    heading:`Continue to ${nextId==="math"?"Mathematics":nextId==="reading"?"Reading":nextId==="science"?"Science":nextId}`,
    guidance:"This is a section transition, not the scheduled ACT break. For realistic practice, move on without taking an extended break; the next section timer starts only when you begin it.",
  };
}

function roundedAverage(values){
  return Math.round(values.reduce((a,b)=>a+b,0)/values.length);
}

function formConsistentSummary(results,sectionIds){
  if(!sectionIds.every(id=>results[id]?.byForm)) return null;
  const formNames=Object.keys(results[sectionIds[0]].byForm);
  if(!formNames.length) return null;
  const values={};
  for(const form of formNames){
    const sectionValues=sectionIds.map(id=>results[id].byForm[form]);
    if(sectionValues.some(value=>!Number.isFinite(value))) return null;
    values[form]=roundedAverage(sectionValues);
  }
  const scores=Object.values(values);
  return {
    estimate:roundedAverage(scores),
    low:Math.min(...scores),
    high:Math.max(...scores),
    byForm:values,
  };
}

export function summarizeFullTest(sectionResults){
  const sectionScores={};
  for(const [sectionId,result] of Object.entries(sectionResults)){
    if(result && Number.isFinite(result.estimate)) sectionScores[sectionId]=result.estimate;
  }
  const coreIds=["english","math","reading"];
  const completedCore=coreIds.every(id=>Number.isFinite(sectionScores[id]));
  const compositeForms=completedCore ? formConsistentSummary(sectionResults,coreIds) : null;
  const hasStem=Number.isFinite(sectionScores.math) && Number.isFinite(sectionScores.science);
  const stemForms=hasStem ? formConsistentSummary(sectionResults,["math","science"]) : null;
  return {
    composite:compositeForms?.estimate ?? estimateComposite(sectionScores),
    compositeLow:compositeForms?.low ?? null,
    compositeHigh:compositeForms?.high ?? null,
    compositeByForm:compositeForms?.byForm ?? null,
    stem:stemForms?.estimate ?? (hasStem ? roundedAverage([sectionScores.math,sectionScores.science]) : null),
    stemLow:stemForms?.low ?? null,
    stemHigh:stemForms?.high ?? null,
    stemByForm:stemForms?.byForm ?? null,
    sectionScores,
    completedCore,
    scienceIncluded:Number.isFinite(sectionScores.science),
  };
}
