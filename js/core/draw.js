import { sample, shuffle } from "./random.js";

function assertUniqueFamilies(items) {
  const seen = new Set();
  for (const q of items) {
    const family = q.variantGroup || q.id;
    if (seen.has(family)) return false;
    seen.add(family);
  }
  return true;
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
  ];
  const result = shuffle(combined, rng);
  if (result.length !== sectionConfig.totalItems || !assertUniqueFamilies(result)) {
    throw new Error("Invalid final section draw");
  }
  return result;
}

export function countBy(items, keyFn) {
  return items.reduce((acc, item) => {
    const key = keyFn(item);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}
