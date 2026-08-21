import { SCIENCE_DATA_REPRESENTATION_SETS } from './science/data-representation.js';
import { SCIENCE_RESEARCH_SUMMARY_SETS } from './science/research-summaries.js';
import { SCIENCE_CONFLICTING_VIEWPOINT_SETS } from './science/conflicting-viewpoints.js';
import { SCIENCE_EXPANSION_DATA_REPRESENTATION_SETS } from './science/expansion-data-representation.js';
import { SCIENCE_EXPANSION_RESEARCH_SUMMARY_SETS } from './science/expansion-research-summaries.js';
import { SCIENCE_EXPANSION_CONFLICTING_VIEWPOINT_SETS } from './science/expansion-conflicting-viewpoints.js';
import { applyScienceChoiceRepairs } from './science-choice-repairs.js';

const RAW_SCIENCE_SETS = [
  ...SCIENCE_DATA_REPRESENTATION_SETS,
  ...SCIENCE_RESEARCH_SUMMARY_SETS,
  ...SCIENCE_CONFLICTING_VIEWPOINT_SETS,
  ...SCIENCE_EXPANSION_DATA_REPRESENTATION_SETS,
  ...SCIENCE_EXPANSION_RESEARCH_SUMMARY_SETS,
  ...SCIENCE_EXPANSION_CONFLICTING_VIEWPOINT_SETS,
];

const DR_SUPPLEMENTS = Object.freeze({
  "S-DR-LEAF": Object.freeze({
    type:"tables",
    tables:[
      {caption:"Light-intensity trial after 12 minutes",columns:["Light intensity (relative units)","Floating disks out of 10"],rows:[["10","1"],["30","4"],["60","8"],["90","9"]]},
      {caption:"Temperature trial at light intensity 60 after 12 minutes",columns:["Temperature (°C)","Floating disks out of 10"],rows:[["10","2"],["20","6"],["30","8"],["40","3"]]},
    ],
  }),
  "S-DR-STREAM": Object.freeze({
    type:"table",
    caption:"Daily rainfall and stream turbidity",
    columns:["Day","Rainfall (mm)","Stream turbidity (NTU)"],
    rows:[["1","0","3"],["2","4","4"],["3","28","21"],["4","6","13"],["5","0","6"]],
  }),
  "S-DR-SOLUBILITY": Object.freeze({
    type:"table",
    caption:"Potassium nitrate solubility in 100 g of water",
    columns:["Temperature (°C)","KNO3 dissolved (g per 100 g water)"],
    rows:[["10","21"],["20","32"],["30","46"],["40","64"],["50","86"]],
  }),
  "S-DR-SOLAR": Object.freeze({
    type:"table",
    caption:"Solar-panel power at four fixed tilt angles",
    columns:["Panel tilt","Morning power (W)","Noon power (W)"],
    rows:[["0°","92","181"],["20°","126","207"],["40°","158","221"],["60°","174","199"]],
  }),
});

function browserDisplayText(id,text){
  if(id==="S-DR-LEAF"){
    return text
      .replace(/\n\nLight intensity \(relative units\) \| Floating disks out of 10\n10 \| 1\n30 \| 4\n60 \| 8\n90 \| 9\n\n/,"\n\n")
      .replace(/\n\nTemperature \(°C\) \| Floating disks out of 10\n10 \| 2\n20 \| 6\n30 \| 8\n40 \| 3\n\n/,"\n\n");
  }
  if(id==="S-DR-STREAM"){
    return text.replace(/\n\nDay \| Rainfall \(mm\) \| Stream turbidity \(NTU\)\n1 \| 0 \| 3\n2 \| 4 \| 4\n3 \| 28 \| 21\n4 \| 6 \| 13\n5 \| 0 \| 6\n\n/,"\n\n");
  }
  if(id==="S-DR-SOLUBILITY"){
    return text.replace(/\n\nTemperature \(°C\) \| KNO3 dissolved \(g per 100 g water\)\n10 \| 21\n20 \| 32\n30 \| 46\n40 \| 64\n50 \| 86\n\n/,"\n\n");
  }
  if(id==="S-DR-SOLAR"){
    return text.replace(/\n\nPanel tilt \| Morning power \(W\) \| Noon power \(W\)\n0° \| 92 \| 181\n20° \| 126 \| 207\n40° \| 158 \| 221\n60° \| 174 \| 199\n\n/,"\n\n");
  }
  return text;
}

const repaired=applyScienceChoiceRepairs(RAW_SCIENCE_SETS);
export const SCIENCE_SETS = Object.freeze(repaired.map(set=>{
  const supplement=DR_SUPPLEMENTS[set.id] || null;
  if(set.format==="DR" && !supplement) throw new Error(`Missing structured Data Representation display for ${set.id}`);
  return Object.freeze({
    ...set,
    displayText:browserDisplayText(set.id,set.text),
    supplement,
  });
}));
