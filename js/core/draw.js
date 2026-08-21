import { shuffle } from "./random.js";

function assertUniqueFamilies(items) {
  const seen = new Set();
  for (const q of items) {
    const family = q.variantGroup || q.id;
    if (seen.has(family)) return false;
    seen.add(family);
  }
  return true;
}

export function shuffleQuestionChoices(question, rng = Math.random) {
  const sourceIndex = "ABCD".indexOf(question.correct);
  if (sourceIndex < 0 || question.choices.length !== 4) throw new Error(`Invalid answer key for ${question.id}`);
  const correctText = question.choices[sourceIndex];
  const choices = shuffle(question.choices, rng);
  const correctIndex = choices.indexOf(correctText);
  if (correctIndex < 0) throw new Error(`Lost semantic answer while shuffling ${question.id}`);
  return { ...question, choices, correct: "ABCD"[correctIndex] };
}

function sampleAvoidingFamilies(pool, count, usedFamilies, rng) {
  const candidates = shuffle(pool, rng);
  const picked = [];
  for (const q of candidates) {
    const family = q.variantGroup || q.id;
    if (usedFamilies.has(family)) continue;
    usedFamilies.add(family);
    picked.push(q);
    if (picked.length === count) return picked;
  }
  throw new Error(`Insufficient distinct variant families for requested draw of ${count}`);
}

export function drawMathSection(bank, sectionConfig, rng = Math.random) {
  const usedFamilies = new Set();
  const operational = [];
  const quotas = sectionConfig.operationalBlueprint;
  for (const [category, count] of Object.entries(quotas)) {
    const pool = bank.filter(q => q.category === category);
    operational.push(...sampleAvoidingFamilies(pool, count, usedFamilies, rng));
  }
  if (operational.length !== sectionConfig.scoredItems) {
    throw new Error(`Operational draw has ${operational.length}; expected ${sectionConfig.scoredItems}`);
  }
  let modeling = operational.filter(q => q.modeling).length;
  if (modeling < sectionConfig.modelingMinimum) {
    const nonModel = operational.filter(q => !q.modeling);
    const replacements = bank.filter(q => q.modeling && !usedFamilies.has(q.variantGroup || q.id));
    while (modeling < sectionConfig.modelingMinimum && nonModel.length && replacements.length) {
      const outgoing = nonModel.pop();
      const idx = operational.indexOf(outgoing);
      const sameCategory = replacements.findIndex(q => q.category === outgoing.category);
      if (sameCategory < 0) continue;
      const incoming = replacements.splice(sameCategory, 1)[0];
      usedFamilies.delete(outgoing.variantGroup || outgoing.id);
      usedFamilies.add(incoming.variantGroup || incoming.id);
      operational[idx] = incoming;
      modeling++;
    }
  }
  if (modeling < sectionConfig.modelingMinimum) throw new Error("Unable to satisfy modeling minimum");

  const remaining = bank.filter(q => !operational.some(x => x.id === q.id));
  const fieldTests = sampleAvoidingFamilies(remaining, sectionConfig.fieldTestItems, usedFamilies, rng);
  const combined = [
    ...operational.map(q => ({ ...q, scored: true })),
    ...fieldTests.map(q => ({ ...q, scored: false })),
  ].map(q => shuffleQuestionChoices(q, rng));
  const result = shuffle(combined, rng);
  if (result.length !== sectionConfig.totalItems || !assertUniqueFamilies(result)) {
    throw new Error("Invalid final section draw");
  }
  return result;
}

function pickPassages(pool, count, usedIds, rng) {
  const candidates = shuffle(pool.filter(p => !usedIds.has(p.id)), rng);
  if (candidates.length < count) throw new Error(`Insufficient passage sets for requested draw of ${count}`);
  const picked = candidates.slice(0, count);
  for (const p of picked) usedIds.add(p.id);
  return picked;
}

function attachPassage(passage, scored, rng) {
  return passage.questions.map((q, index) => shuffleQuestionChoices({
    ...q,
    scored,
    passageId: passage.id,
    passageTitle: passage.title,
    passageText: passage.text,
    passageLength: passage.length,
    passageGenre: passage.genre,
    passageQuestionNumber: index + 1,
  }, rng));
}

function assertRangeBlueprint(items, blueprint) {
  const counts = countBy(items, q => q.category);
  for (const [category, range] of Object.entries(blueprint)) {
    const value = counts[category] || 0;
    const [min, max] = range;
    if (value < min || value > max) {
      throw new Error(`${category} count ${value} is outside ${min}-${max}`);
    }
  }
}

export function drawEnglishSection(passages, sectionConfig, rng = Math.random) {
  const usedIds = new Set();
  const longs = passages.filter(p => p.length === "long" && p.questions.length === 10);
  const shorts = passages.filter(p => p.length === "short" && p.questions.length === 5);

  const operationalPassages = [
    ...pickPassages(longs, 3, usedIds, rng),
    ...pickPassages(shorts, 2, usedIds, rng),
  ];
  const operational = operationalPassages.flatMap(p => attachPassage(p, true, rng));
  if (operational.length !== sectionConfig.scoredItems) {
    throw new Error(`English operational draw has ${operational.length}; expected ${sectionConfig.scoredItems}`);
  }
  assertRangeBlueprint(operational, sectionConfig.operationalBlueprint);

  const remainingLongs = longs.filter(p => !usedIds.has(p.id));
  const remainingShorts = shorts.filter(p => !usedIds.has(p.id));
  const canLong = remainingLongs.length >= 1;
  const canShort = remainingShorts.length >= 2;
  if (!canLong && !canShort) throw new Error("Insufficient English passages for embedded field-test set");

  const useLongFieldTest = canLong && (!canShort || rng() < 0.5);
  const fieldPassages = useLongFieldTest
    ? pickPassages(remainingLongs, 1, usedIds, rng)
    : pickPassages(remainingShorts, 2, usedIds, rng);

  const sets = shuffle([
    ...operationalPassages.map(p => ({ passage: p, scored: true })),
    ...fieldPassages.map(p => ({ passage: p, scored: false })),
  ], rng);
  const result = sets.flatMap(({ passage, scored }) => attachPassage(passage, scored, rng));
  if (result.length !== sectionConfig.totalItems) throw new Error("Invalid English final section draw");
  if (new Set(sets.map(s => s.passage.id)).size !== sets.length) throw new Error("English passage reused within section");
  return result;
}

export function countBy(items, keyFn) {
  return items.reduce((acc, item) => {
    const key = keyFn(item);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}
