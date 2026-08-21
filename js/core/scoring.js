export const OFFICIAL_PRACTICE_CONVERSIONS = Object.freeze({"form1":{"english":[1,2,3,5,6,7,7,8,9,10,10,10,11,11,12,13,13,14,15,15,16,17,18,19,20,20,21,22,22,23,24,25,26,27,28,29,31,33,35,35,36],"math":[1,5,7,9,11,12,13,13,14,14,15,15,15,16,16,17,17,17,18,19,19,20,21,22,23,24,25,26,27,27,28,29,29,30,31,32,33,34,34,35,36,36],"reading":[1,3,5,7,9,10,11,12,12,13,14,15,16,17,18,20,21,22,23,24,25,26,28,30,32,34,35,36],"science":[1,3,6,7,9,10,11,12,12,14,15,16,17,18,18,19,20,21,22,23,23,24,25,25,26,27,28,29,30,31,32,33,34,35,36]},"form2":{"english":[1,2,4,5,6,7,8,9,10,10,11,11,11,12,13,14,14,15,15,16,17,18,19,20,20,21,21,22,23,23,24,25,26,27,28,30,32,34,35,35,36],"math":[1,4,7,9,10,11,12,13,14,14,14,15,15,15,16,16,16,17,17,17,18,18,19,20,21,22,23,24,25,25,26,27,27,28,29,30,31,33,34,35,36,36],"reading":[1,3,5,7,9,10,11,11,12,13,14,15,16,17,18,20,21,22,23,24,25,27,28,30,32,34,35,36],"science":[1,3,5,7,9,10,11,11,12,13,14,15,16,17,18,18,19,20,21,21,22,23,23,24,24,25,26,26,27,28,30,32,34,35,36]}});

function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

export function estimateSectionScore(sectionId, rawScore) {
  const tables = Object.values(OFFICIAL_PRACTICE_CONVERSIONS).map(f => f[sectionId]);
  if (!tables.length || !tables[0]) throw new Error(`No scoring model for ${sectionId}`);
  const maxRaw = tables[0].length - 1;
  const raw = clamp(Math.round(rawScore), 0, maxRaw);
  const values = tables.map(t => t[raw]);
  const estimate = Math.round(values.reduce((a,b) => a+b, 0) / values.length);
  return { raw, maxRaw, estimate, low: Math.min(...values), high: Math.max(...values) };
}

export function estimateComposite(sectionScores) {
  const ids = ["english", "math", "reading"];
  const vals = ids.map(id => sectionScores[id]).filter(Number.isFinite);
  if (vals.length !== 3) return null;
  return Math.round(vals.reduce((a,b) => a+b,0) / 3);
}

export function scoreResponses(questions, responses, sectionId) {
  const scored = questions.filter(q => q.scored !== false);
  let raw = 0;
  const categories = {};
  for (const q of scored) {
    categories[q.category] ||= { correct: 0, total: 0 };
    categories[q.category].total++;
    if (responses[q.id] === q.correct) {
      raw++;
      categories[q.category].correct++;
    }
  }
  return { ...estimateSectionScore(sectionId, raw), categories, totalDisplayed: questions.length };
}
