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

const repaired=applyScienceChoiceRepairs(RAW_SCIENCE_SETS);
export const SCIENCE_SETS = Object.freeze(repaired.map(set=>{
  const supplement=DR_SUPPLEMENTS[set.id] || null;
  if(set.format==="DR" && !supplement) throw new Error(`Missing structured Data Representation display for ${set.id}`);
  return Object.freeze({...set,supplement});
}));
