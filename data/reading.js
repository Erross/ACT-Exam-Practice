import { READING_LITERARY_PASSAGES } from './reading/literary.js';
import { READING_INFORMATIONAL_SINGLE_PASSAGES } from './reading/informational-single.js';
import { READING_INFORMATIONAL_MULTI_PASSAGES } from './reading/informational-multi.js';

export const READING_PASSAGES = Object.freeze([
  ...READING_LITERARY_PASSAGES,
  ...READING_INFORMATIONAL_SINGLE_PASSAGES,
  ...READING_INFORMATIONAL_MULTI_PASSAGES,
]);
