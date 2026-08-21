import { NUMBER_QUANTITY_QUESTIONS } from './math/number-quantity.js';
import { ALGEBRA_QUESTIONS } from './math/algebra.js';
import { FUNCTION_QUESTIONS } from './math/functions.js';
import { GEOMETRY_QUESTIONS } from './math/geometry.js';
import { STATISTICS_QUESTIONS } from './math/statistics.js';
import { IES_QUESTIONS } from './math/integrating-essential-skills.js';

export const MATH_QUESTIONS = Object.freeze([
  ...NUMBER_QUANTITY_QUESTIONS,
  ...ALGEBRA_QUESTIONS,
  ...FUNCTION_QUESTIONS,
  ...GEOMETRY_QUESTIONS,
  ...STATISTICS_QUESTIONS,
  ...IES_QUESTIONS,
]);
