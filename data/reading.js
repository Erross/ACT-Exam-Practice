import { READING_LITERARY_PASSAGES } from './reading/literary.js';
import { READING_INFORMATIONAL_SINGLE_PASSAGES } from './reading/informational-single.js';
import { READING_INFORMATIONAL_MULTI_PASSAGES } from './reading/informational-multi.js';
import { READING_EXPANSION_V1 } from './reading/expansion-v1.js';
import { READING_RELEASE_EXPANSION } from './reading/release-expansion.js';
import { READING_TEXT_FIDELITY } from './reading-text-fidelity.js';
import { applyReadingChoiceRepairs } from './reading-choice-repairs.js';
import { applyReadingTellRepairs } from './reading-tell-repairs.js';
import { rebalanceGroupedQuestions } from './choice-position-normalizer.js';

const RAW_READING_PASSAGES = [
  ...READING_LITERARY_PASSAGES,
  ...READING_INFORMATIONAL_SINGLE_PASSAGES,
  ...READING_INFORMATIONAL_MULTI_PASSAGES,
  ...READING_EXPANSION_V1,
  ...READING_RELEASE_EXPANSION,
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

function browserDisplayText(id,text){
  if(id==="R-INFO-VQI-BIKES"){
    return text.replace(/\n\nDATA SUMMARY\nYear before lane:[^\n]*\nFirst year after:[^\n]*\nSecond year after:[^\n]*\n\n/,"\n\n");
  }
  if(id==="R-VQI-BIKESHARE"){
    return text.replace(/\n\nStation \| Bikes at 7:30 \| Empty docks \| Expected net change by 8:30\nMaple[^\n]*\nCentral[^\n]*\nRiver[^\n]*\nMarket[^\n]*\n\n/,"\n\n");
  }
  return text;
}

const repaired=applyReadingTellRepairs(applyReadingChoiceRepairs(RAW_READING_PASSAGES));
const enriched=repaired.map(passage=>{
  const text=READING_TEXT_FIDELITY[passage.id] || passage.text;
  const supplement=VQI_SUPPLEMENTS[passage.id] || null;
  if(!text) throw new Error(`Missing ACT-length Reading text for ${passage.id}`);
  if(passage.format==="vqi" && !supplement) throw new Error(`Missing structured VQI supplement for ${passage.id}`);
  return {
    ...passage,
    text,
    displayText:browserDisplayText(passage.id,text),
    supplement,
  };
});

export const READING_PASSAGES = Object.freeze(rebalanceGroupedQuestions(enriched).map(Object.freeze));
