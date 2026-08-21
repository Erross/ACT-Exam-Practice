import { SCIENCE_DATA_REPRESENTATION_SETS } from './science/data-representation.js';
import { SCIENCE_RESEARCH_SUMMARY_SETS } from './science/research-summaries.js';
import { SCIENCE_CONFLICTING_VIEWPOINT_SETS } from './science/conflicting-viewpoints.js';
import { SCIENCE_EXPANSION_DATA_REPRESENTATION_SETS } from './science/expansion-data-representation.js';
import { SCIENCE_EXPANSION_RESEARCH_SUMMARY_SETS } from './science/expansion-research-summaries.js';
import { SCIENCE_EXPANSION_CONFLICTING_VIEWPOINT_SETS } from './science/expansion-conflicting-viewpoints.js';
import { SCIENCE_RELEASE_EXPANSION } from './science/release-expansion.js';
import { applyScienceChoiceRepairs } from './science-choice-repairs.js';
import { applyScienceTellRepairs } from './science-tell-repairs.js';
import { rebalanceGroupedQuestions } from './choice-position-normalizer.js';

const RAW_SCIENCE_SETS = [
  ...SCIENCE_DATA_REPRESENTATION_SETS,
  ...SCIENCE_RESEARCH_SUMMARY_SETS,
  ...SCIENCE_CONFLICTING_VIEWPOINT_SETS,
  ...SCIENCE_EXPANSION_DATA_REPRESENTATION_SETS,
  ...SCIENCE_EXPANSION_RESEARCH_SUMMARY_SETS,
  ...SCIENCE_EXPANSION_CONFLICTING_VIEWPOINT_SETS,
  ...SCIENCE_RELEASE_EXPANSION,
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
  "S-DR-BATTERY": Object.freeze({
    type:"table",
    caption:"Rechargeable battery performance at five chamber temperatures",
    columns:["Temperature (°C)","Runtime (min)","Terminal voltage after 60 min (V)"],
    rows:[["0","82","3.62"],["10","96","3.68"],["20","111","3.73"],["30","118","3.75"],["40","105","3.70"]],
  }),
  "S-DR-ALBEDO": Object.freeze({
    type:"table",
    caption:"Solar reflectance and surface temperature after equal sunlight exposure",
    columns:["Material","Solar reflectance (%)","Surface temperature (°C)"],
    rows:[["Dark asphalt","8","54"],["Weathered concrete","28","46"],["Pale paver","52","39"],["Coated paver","71","34"]],
  }),
  "S-DR-RECOVERY": Object.freeze({
    type:"table",
    caption:"Mean heart rate during recovery from the same cycling protocol",
    columns:["Minutes after exercise","Trained group (beats/min)","Untrained group (beats/min)"],
    rows:[["0","168","170"],["2","132","145"],["4","108","124"],["6","92","108"],["8","82","96"]],
  }),
});

// Browser prose is deliberately separate from the canonical source text for DR
// sets. The source keeps the synthetic numeric data inline for auditability;
// students see those values once, in the accessible structured table(s).
const DR_DISPLAY_TEXT = Object.freeze({
  "S-DR-LEAF": `Students placed equal numbers of spinach leaf disks in bicarbonate solution under four light intensities. As photosynthesis produced oxygen inside the disks, buoyant disks rose to the surface. After 12 minutes the students recorded the number of floating disks out of 10.\n\nA second trial used the same procedure at light intensity 60 but different solution temperatures.`,
  "S-DR-STREAM": `A monitoring station measured daily rainfall and the turbidity of a stream. Turbidity is reported in nephelometric turbidity units (NTU); higher values indicate more suspended particles in the water.\n\nThe stream's long-term dry-weather turbidity at this station is approximately 3 NTU.`,
  "S-DR-SOLUBILITY": `A student measured the maximum mass of potassium nitrate (KNO3) that dissolved in 100 g of water at several temperatures. A saturated solution contains the maximum amount that dissolves under the stated conditions.\n\nThe student used the same mass of water at every temperature and stirred each mixture for the same length of time before determining whether additional solid would dissolve.`,
  "S-DR-SOLAR": `A design team tested one solar panel at four fixed tilt angles. The panel area, orientation toward south, electrical load, and measurement equipment were unchanged. Power output was recorded once in the morning and once near solar noon on a clear day.\n\nThe team wants to choose a fixed tilt for a device that must operate throughout the daylight period rather than only at noon.`,
  "S-DR-BATTERY": `A team tested identical rechargeable battery packs in a temperature-controlled chamber. Each pack powered the same device at the same electrical load until the device reached its low-voltage cutoff.\n\nThe team recorded total runtime and the terminal voltage after 60 minutes for each chamber temperature.`,
  "S-DR-ALBEDO": `Engineers placed four pavement samples of equal area in full sunlight for the same two-hour period. They measured each material's solar reflectance and its surface temperature at the end of the exposure.\n\nThe test was designed to compare candidate surfaces for an outdoor paving project.`,
  "S-DR-RECOVERY": `Two groups completed the same six-minute cycling protocol. Researchers recorded mean heart rate immediately after exercise and every two minutes during an eight-minute recovery period.\n\nThe groups differed in prior endurance training but followed the same exercise and measurement schedule.`,
});

const repaired=applyScienceTellRepairs(applyScienceChoiceRepairs(RAW_SCIENCE_SETS));
const enriched=repaired.map(set=>{
  const supplement=DR_SUPPLEMENTS[set.id] || null;
  if(set.format==="DR" && !supplement) throw new Error(`Missing structured Data Representation display for ${set.id}`);
  if(set.format==="DR" && !DR_DISPLAY_TEXT[set.id]) throw new Error(`Missing browser prose for Data Representation set ${set.id}`);
  return {
    ...set,
    displayText:set.format==="DR" ? DR_DISPLAY_TEXT[set.id] : set.text,
    supplement,
  };
});

export const SCIENCE_SETS = Object.freeze(rebalanceGroupedQuestions(enriched).map(Object.freeze));
