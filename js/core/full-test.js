import { estimateComposite } from "./scoring.js";

export function buildFullTestQueue(includeScience=false){
  return includeScience
    ? ["english","math","reading","science"]
    : ["english","math","reading"];
}

export function summarizeFullTest(sectionResults){
  const sectionScores={};
  for(const [sectionId,result] of Object.entries(sectionResults)){
    if(result && Number.isFinite(result.estimate)) sectionScores[sectionId]=result.estimate;
  }
  return {
    composite: estimateComposite(sectionScores),
    sectionScores,
    completedCore:["english","math","reading"].every(id=>Number.isFinite(sectionScores[id])),
    scienceIncluded:Number.isFinite(sectionScores.science),
  };
}
