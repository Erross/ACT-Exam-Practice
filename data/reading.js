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

export const READING_PASSAGES = Object.freeze(applyReadingChoiceRepairs(RAW_READING_PASSAGES));
