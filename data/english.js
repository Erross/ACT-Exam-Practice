import { ENGLISH_LONG_A } from './english/long-a.js';
import { ENGLISH_LONG_B } from './english/long-b.js';
import { ENGLISH_SHORT_A } from './english/short-a.js';
import { ENGLISH_SHORT_B } from './english/short-b.js';
import { ENGLISH_EXPANSION_LONG } from './english/expansion-long.js';
import { ENGLISH_EXPANSION_SHORT } from './english/expansion-short.js';
import { ENGLISH_TEXT_FIDELITY } from './english-text-fidelity.js';
import { applyEnglishChoiceRepairs } from './english-choice-repairs.js';
import { rebalanceGroupedQuestions } from './choice-position-normalizer.js';

const RAW_PASSAGES = [
  ...ENGLISH_LONG_A,
  ...ENGLISH_LONG_B,
  ...ENGLISH_SHORT_A,
  ...ENGLISH_SHORT_B,
  ...ENGLISH_EXPANSION_LONG,
  ...ENGLISH_EXPANSION_SHORT,
];

// ACT treats writing type (informational/argumentative/narrative) separately from
// subject/content genre. Preserve the legacy source `genre` as the writing type at
// the aggregation boundary and attach an independent content-domain code.
const CONTENT_DOMAIN_BY_ID = Object.freeze({
  "E-L1":"SSC", "E-L2":"NSC", "E-L3":"NSC", "E-L4":"HUM", "E-L5":"HUM", "E-L6":"SSC",
  "E-S1":"NSC", "E-S2":"SSC", "E-S3":"HUM", "E-S4":"NSC", "E-S5":"NSC", "E-S6":"SSC",
});

const repaired=applyEnglishChoiceRepairs(RAW_PASSAGES);
const enriched=repaired.map(passage=>{
  const domain=CONTENT_DOMAIN_BY_ID[passage.id];
  const text=ENGLISH_TEXT_FIDELITY[passage.id];
  if(!domain) throw new Error(`Missing English content-domain metadata for ${passage.id}`);
  if(!text) throw new Error(`Missing ACT-length English text for ${passage.id}`);
  return {
    ...passage,
    text,
    writingType: passage.genre,
    domain,
  };
});

export const ENGLISH_PASSAGES = Object.freeze(rebalanceGroupedQuestions(enriched).map(Object.freeze));
