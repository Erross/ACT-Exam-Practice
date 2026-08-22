import { NUMBER_QUANTITY_QUESTIONS } from './math/number-quantity.js';
import { ALGEBRA_QUESTIONS } from './math/algebra.js';
import { FUNCTION_QUESTIONS } from './math/functions.js';
import { GEOMETRY_QUESTIONS } from './math/geometry.js';
import { STATISTICS_QUESTIONS } from './math/statistics.js';
import { IES_QUESTIONS } from './math/integrating-essential-skills.js';
import { MATH_DIFFICULTY_BY_FAMILY } from './math-difficulty.js';
import { applyMathChoiceRepairs } from './math-choice-repairs.js';
import { applyMathCleanroomRepairs } from './math-cleanroom-repairs.js';

const RAW_MATH_QUESTIONS = [
  ...NUMBER_QUANTITY_QUESTIONS,
  ...ALGEBRA_QUESTIONS,
  ...FUNCTION_QUESTIONS,
  ...GEOMETRY_QUESTIONS,
  ...STATISTICS_QUESTIONS,
  ...IES_QUESTIONS,
];

const repaired=applyMathCleanroomRepairs(applyMathChoiceRepairs(RAW_MATH_QUESTIONS));
export const MATH_QUESTIONS = Object.freeze(repaired.map(question=>{
  const difficulty=MATH_DIFFICULTY_BY_FAMILY[question.variantGroup];
  if(!difficulty) throw new Error(`Missing reviewed Math difficulty for ${question.variantGroup}`);
  return Object.freeze({...question,difficulty});
}));
