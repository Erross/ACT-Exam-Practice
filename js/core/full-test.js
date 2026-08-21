import { estimateComposite } from "./scoring.js";

export function buildFullTestQueue(includeScience=false){
  return includeScience
    ? ["english","math","reading","science"]
    : ["english","math","reading"];
}

function roundedAverage(values){
  return Math.round(values.reduce((a,b)=>a+b,0)/values.length);
}

export function summarizeFullTest(sectionResults){
  const sectionScores={};
  for(const [sectionId,result] of Object.entries(sectionResults)){
    if(result && Number.isFinite(result.estimate)) sectionScores[sectionId]=result.estimate;
  }
  const coreIds=["english","math","reading"];
  const completedCore=coreIds.every(id=>Number.isFinite(sectionScores[id]));
  const coreResults=coreIds.map(id=>sectionResults[id]);
  const hasCompositeRanges=completedCore && coreResults.every(r=>Number.isFinite(r?.low) && Number.isFinite(r?.high));
  const hasStem=Number.isFinite(sectionScores.math) && Number.isFinite(sectionScores.science);
  const stemResults=[sectionResults.math,sectionResults.science];
  const hasStemRanges=hasStem && stemResults.every(r=>Number.isFinite(r?.low) && Number.isFinite(r?.high));
  return {
    composite: estimateComposite(sectionScores),
    compositeLow: hasCompositeRanges ? roundedAverage(coreResults.map(r=>r.low)) : null,
    compositeHigh: hasCompositeRanges ? roundedAverage(coreResults.map(r=>r.high)) : null,
    stem: hasStem ? roundedAverage([sectionScores.math,sectionScores.science]) : null,
    stemLow: hasStemRanges ? roundedAverage(stemResults.map(r=>r.low)) : null,
    stemHigh: hasStemRanges ? roundedAverage(stemResults.map(r=>r.high)) : null,
    sectionScores,
    completedCore,
    scienceIncluded:Number.isFinite(sectionScores.science),
  };
}
