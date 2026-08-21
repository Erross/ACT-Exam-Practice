import { ENGLISH_LONG_A } from './english/long-a.js';
import { ENGLISH_LONG_B } from './english/long-b.js';
import { ENGLISH_SHORT_A } from './english/short-a.js';
import { ENGLISH_SHORT_B } from './english/short-b.js';
import { ENGLISH_EXPANSION_LONG } from './english/expansion-long.js';
import { ENGLISH_EXPANSION_SHORT } from './english/expansion-short.js';

export const ENGLISH_PASSAGES = Object.freeze([
  ...ENGLISH_LONG_A,
  ...ENGLISH_LONG_B,
  ...ENGLISH_SHORT_A,
  ...ENGLISH_SHORT_B,
  ...ENGLISH_EXPANSION_LONG,
  ...ENGLISH_EXPANSION_SHORT,
]);
