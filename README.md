# ACT Exam Practice

A free, unofficial practice application for the **enhanced ACT**. The project is being built as a sibling to `Erross/AP-Exam-Practice`, but with a neutral exam/section architecture so both products can later be combined into a single application without rewriting their content banks.

## Current development status

`main` is intentionally minimal until the first release is ready. Active work is on `feature/v1-foundation` through draft PR #1.

The current development build provides:

- a static HTML/CSS/JavaScript application suitable for GitHub Pages;
- generic exam/section configuration rather than AP-specific assumptions;
- current enhanced-ACT section lengths and embedded field-test counts;
- runnable timed practice for English, Mathematics, Reading, and optional Science;
- full-test mode running English → Mathematics → Reading, with optional Science afterward;
- scores hidden between sections during full-test mode;
- estimated 1–36 section scores and an estimated ACT Composite after a complete core attempt;
- estimated-score ranges derived from two official enhanced ACT practice-form conversion tables;
- runtime answer-choice shuffling that preserves the semantic key;
- constrained passage/set drawing so linked material remains intact;
- automated blueprint, scoring, bank-integrity, and build tests, including repeated 500-draw blueprint checks.

### Current draft bank size

| Section | Draft content | Displayed per attempt |
| --- | ---: | ---: |
| English | 60 questions across 8 original passages | 50 |
| Mathematics | 140 original questions across 70 variant families | 45 |
| Reading | 54 questions across 6 original passages | 36 |
| Science | 40 questions across 7 original science sets | 40 |
| **Total** | **294 questions** | — |

These banks are **development drafts, not released banks**. English, Reading, and Science are currently close to minimum runnable scale and require substantial expansion before release. All four sections require independent clean-room content review and repair before promotion.

## Enhanced ACT structure modeled

| Section | Total items | Scored items | Field-test items | Time |
| --- | ---: | ---: | ---: | ---: |
| English | 50 | 40 | 10 | 35 min |
| Mathematics | 45 | 41 | 4 | 50 min |
| Reading | 36 | 27 | 9 | 40 min |
| Science (optional) | 40 | 34 | 6 | 40 min |

The Composite is based on English, Mathematics, and Reading. Science is optional and does not affect the Composite.

The constrained engines also model the current enhanced passage/set structure: English uses 3 long + 2 short scored passage sets; Reading uses 3 scored + 1 EFT passage with literary/informational, length, and single/paired/VQI constraints; Science uses 2 Data Representation + 3 Research Summaries + 1 Conflicting Viewpoints scored sets plus one six-item EFT set, category ranges, domain balance, and the background-knowledge item range.

## Score estimates

This project **does provide an estimated ACT section score and estimated Composite score**. Estimates are intentionally labeled as such.

The initial scoring model uses the published raw-to-scale tables from two official enhanced ACT online practice tests. For a section raw score, the UI shows the mean rounded estimate and the observed range across those two official practice forms. For a full test, the Composite estimate is the rounded mean of English, Mathematics, and Reading estimates; a combined low/high range is also shown from the corresponding official-practice conversion ranges.

Real ACT forms are equated separately, so these results are not official ACT score predictions.

See `SCORE_MODEL.md`.

## Development

Requires Node.js 22+.

```bash
npm test
npm run build
npm run check
```

The build outputs `_site/` for GitHub Pages.

## Release philosophy

A section is not released merely because it has enough questions or passes automated tests. Before promotion it must pass:

1. authoritative blueprint verification;
2. bank/schema and constrained-draw tests;
3. answer/rationale and quantitative correctness review;
4. distractor, answer-position, duplicate/variant, and difficulty audits;
5. browser-effective parity and usability checks;
6. retake-overlap review once the bank is large enough for meaningful alternate forms;
7. independent clean-room review after repairs.

The draft PR remains open until the banks are expanded and those release gates are complete.

## Copyright and affiliation

Questions and passages in this repository are original practice material. This project does not copy secure or released ACT questions.

This project is independent and is not affiliated with, endorsed by, sponsored by, or reviewed by ACT Education Corp. ACT is a trademark of ACT Education Corp.
