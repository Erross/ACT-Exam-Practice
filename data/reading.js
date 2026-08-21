import { READING_LITERARY_PASSAGES } from './reading/literary.js';
import { READING_INFORMATIONAL_SINGLE_PASSAGES } from './reading/informational-single.js';
import { READING_INFORMATIONAL_MULTI_PASSAGES } from './reading/informational-multi.js';
import { READING_EXPANSION_V1 } from './reading/expansion-v1.js';
import { applyReadingChoiceRepairs } from './reading-choice-repairs.js';

const RAW_READING_PASSAGES = [
  ...READING_LITERARY_PASSAGES,
  ...READING_INFORMATIONAL_SINGLE_PASSAGES,
  ...READING_INFORMATIONAL_MULTI_PASSAGES,
  ...READING_EXPANSION_V1,
];

const VQI_SUPPLEMENTS = Object.freeze({
  "R-INFO-VQI-BIKES": Object.freeze({
    type:"table",
    caption:"Harbor Avenue bicycle use, reported crashes, and heavy-rain days",
    columns:["Study year","Bicycle trips","Reported bicycle crashes","Heavy-rain days"],
    rows:[
      ["Year before lane","418,000","18","31"],
      ["First year after","503,000","16","29"],
      ["Second year after","557,000","15","24"],
    ],
  }),
  "R-VQI-BIKESHARE": Object.freeze({
    type:"table",
    caption:"Bike-share station conditions at 7:30 a.m. and expected net change by 8:30 a.m.",
    columns:["Station","Bikes at 7:30","Empty docks","Expected net change by 8:30"],
    rows:[
      ["Maple","6","14","−5"],
      ["Central","15","5","+4"],
      ["River","10","10","−2"],
      ["Market","18","2","+3"],
    ],
  }),
});

const repaired=applyReadingChoiceRepairs(RAW_READING_PASSAGES);
export const READING_PASSAGES = Object.freeze(repaired.map(passage=>{
  const supplement=VQI_SUPPLEMENTS[passage.id] || null;
  if(passage.format==="vqi" && !supplement) throw new Error(`Missing structured VQI supplement for ${passage.id}`);
  return Object.freeze({...passage,supplement});
}));
