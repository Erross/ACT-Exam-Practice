import { SCIENCE_DATA_REPRESENTATION_SETS } from './science/data-representation.js';
import { SCIENCE_RESEARCH_SUMMARY_SETS } from './science/research-summaries.js';
import { SCIENCE_CONFLICTING_VIEWPOINT_SETS } from './science/conflicting-viewpoints.js';

export const SCIENCE_SETS = Object.freeze([
  ...SCIENCE_DATA_REPRESENTATION_SETS,
  ...SCIENCE_RESEARCH_SUMMARY_SETS,
  ...SCIENCE_CONFLICTING_VIEWPOINT_SETS,
]);
