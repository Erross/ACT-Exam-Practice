// Internal practice difficulty bands used to preserve ACT's increasing-difficulty
// section behavior. These are editorial difficulty judgments, not ACT-calibrated
// item parameters. Variant-family siblings deliberately share a band.
export const MATH_DIFFICULTY_BY_FAMILY = Object.freeze({
  // Number & Quantity
  "nq-fractions":"easy", "nq-exponents":"easy", "nq-radicals":"medium", "nq-complex":"medium",
  "nq-scientific":"medium", "nq-percent":"easy", "nq-ratio":"easy", "nq-absolute":"easy",
  "nq-sequences":"medium", "nq-remainder":"easy",

  // Algebra
  "a-linear1":"easy", "a-linear2":"medium", "a-system1":"medium", "a-system2":"medium",
  "a-quadratic-roots":"medium", "a-quadratic-vertex":"hard", "a-inequality":"easy", "a-absolute-eq":"hard",
  "a-factor":"hard", "a-rational":"hard", "a-radical-eq":"easy", "a-exponential-eq":"easy",
  "a-word-linear":"easy", "a-mixture":"hard",

  // Functions
  "f-evaluate":"easy", "f-compose":"hard", "f-inverse":"hard", "f-domain-rational":"easy",
  "f-domain-radical":"easy", "f-transform":"medium", "f-slope":"easy", "f-line-equation":"medium",
  "f-exponential-growth":"medium", "f-exponential-value":"medium", "f-log":"medium", "f-piecewise":"hard",
  "f-zero":"easy", "f-average-rate":"hard",

  // Geometry
  "g-pythag":"easy", "g-distance":"medium", "g-midpoint":"easy", "g-circle-area":"easy",
  "g-circle-circ":"easy", "g-arc":"hard", "g-triangle-area":"easy", "g-similar":"hard",
  "g-volume-prism":"easy", "g-cylinder":"hard", "g-trig-sin":"hard", "g-angle":"easy",
  "g-polygon":"medium", "g-coordinate-parallel":"medium",

  // Statistics & Probability
  "s-mean":"easy", "s-median":"easy", "s-simple-prob":"easy", "s-independent":"medium",
  "s-combination":"hard", "s-expected":"hard", "s-range-iqr":"easy", "s-weighted":"medium",

  // Integrating Essential Skills
  "ies-rate":"easy", "ies-unit":"easy", "ies-percentchange":"easy", "ies-proportion":"easy",
  "ies-average-speed":"hard", "ies-work":"hard", "ies-scale":"easy", "ies-tax-tip":"easy",
  "ies-density":"easy", "ies-budget":"hard",
});
