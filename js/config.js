export const EXAM = Object.freeze({
  id: "act-enhanced",
  family: "act",
  name: "ACT Practice",
  version: "enhanced-2026",
  compositeSections: ["english", "math", "reading"],
  optionalSections: ["science"],
  writingSupported: false,
});

export const SECTIONS = Object.freeze({
  english: {
    id: "english", label: "English", totalItems: 50, scoredItems: 40, fieldTestItems: 10,
    minutes: 35, status: "planned",
    operationalBlueprint: { POW: [15,17], KLA: [7,9], CSE: [15,17] },
  },
  math: {
    id: "math", label: "Mathematics", totalItems: 45, scoredItems: 41, fieldTestItems: 4,
    minutes: 50, status: "draft",
    operationalBlueprint: { NQ: 5, A: 8, F: 8, G: 8, S: 4, IES: 8 },
    modelingMinimum: 8,
  },
  reading: {
    id: "reading", label: "Reading", totalItems: 36, scoredItems: 27, fieldTestItems: 9,
    minutes: 40, status: "planned",
    operationalBlueprint: { KID: [12,14], CS: [7,9], IKI: [5,7] },
  },
  science: {
    id: "science", label: "Science", totalItems: 40, scoredItems: 34, fieldTestItems: 6,
    minutes: 40, status: "planned", optional: true,
    operationalBlueprint: { IOD: [13,17], SIN: [6,11], EAM: [8,13] },
  },
});

export const MATH_CATEGORY_LABELS = Object.freeze({
  NQ: "Number & Quantity",
  A: "Algebra",
  F: "Functions",
  G: "Geometry",
  S: "Statistics & Probability",
  IES: "Integrating Essential Skills",
});
