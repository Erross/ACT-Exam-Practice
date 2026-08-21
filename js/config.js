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
    minutes: 35, status: "draft",
    operationalBlueprint: { POW: [15,17], KLA: [7,9], CSE: [15,17] },
  },
  math: {
    id: "math", label: "Mathematics", totalItems: 45, scoredItems: 41, fieldTestItems: 4,
    minutes: 50, status: "draft",
    // One valid fixed form inside ACT's final enhanced operational ranges:
    // PHM 33 = NQ 5 + Algebra 7 + Functions 8 + Geometry 8 + Statistics & Probability 5;
    // IES 8. Modeling overlaps these categories and must cover at least 8 operational items.
    operationalBlueprint: { NQ: 5, A: 7, F: 8, G: 8, S: 5, IES: 8 },
    modelingMinimum: 8,
  },
  reading: {
    id: "reading", label: "Reading", totalItems: 36, scoredItems: 27, fieldTestItems: 9,
    minutes: 40, status: "draft",
    operationalBlueprint: { KID: [12,14], CS: [7,9], IKI: [5,7] },
  },
  science: {
    id: "science", label: "Science", totalItems: 40, scoredItems: 34, fieldTestItems: 6,
    minutes: 40, status: "draft", optional: true,
    operationalBlueprint: { IOD: [13,17], SIN: [6,11], EAM: [8,13] },
    // Fixed valid form within ACT's final enhanced passage ranges.
    operationalFormatBlueprint: { DR: 2, RS: 3, CV: 1 },
    operationalFormatItemTotals: { DR: 10, RS: 18, CV: 6 },
    operationalDomainBlueprint: { life: 2, earth: 1, physics: 1, chemistry: 1, engineering: 1 },
    backgroundKnowledgeRange: [5,8],
  },
});

export const CATEGORY_LABELS = Object.freeze({
  english: Object.freeze({
    POW: "Production of Writing",
    KLA: "Knowledge of Language",
    CSE: "Conventions of Standard English",
  }),
  math: Object.freeze({
    NQ: "Number & Quantity",
    A: "Algebra",
    F: "Functions",
    G: "Geometry",
    S: "Statistics & Probability",
    IES: "Integrating Essential Skills",
  }),
  reading: Object.freeze({
    KID: "Key Ideas & Details",
    CS: "Craft & Structure",
    IKI: "Integration of Knowledge & Ideas",
  }),
  science: Object.freeze({
    IOD: "Interpretation of Data",
    SIN: "Scientific Investigation",
    EAM: "Evaluating Scientific Arguments and Models with Evidence",
  }),
});
