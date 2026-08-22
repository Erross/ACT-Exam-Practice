# ACT Exam Practice

A free, original, unofficial practice application for the **enhanced ACT**. The project is built with a neutral exam/section architecture so its core concepts can later be shared with `Erross/AP-Exam-Practice` without making ACT content depend on AP-specific assumptions.

## Current development status

`main` remains intentionally minimal until the first release passes its complete release gate. Active development is on `feature/v1-foundation` through draft PR #1.

The current candidate provides:

- static HTML/CSS/JavaScript suitable for GitHub Pages;
- runnable timed English, Mathematics, Reading, and optional Science practice;
- full-test mode: English → Mathematics → Reading, with optional Science afterward;
- preflight before the timer starts;
- question navigator with answered/current/flagged state;
- saved-attempt recovery using an absolute deadline, including flags and full-test between-section state;
- explicit submission with unanswered/flagged review warning and automatic timeout submission;
- section scores hidden between full-test sections;
- answer review with the actual displayed choice order and rationales;
- estimated 1–36 section scores, estimated ACT Composite, and estimated STEM when Science is taken;
- score ranges derived from two current official enhanced-ACT online-practice conversion tables;
- runtime answer-choice shuffling with semantic-key preservation;
- constrained whole-passage/set drawing and embedded non-scored field-test handling;
- production-scale automated evidence: 5,000 valid forms per section and 5,000 independent retake pairs per section;
- build and production-artifact verification.

### Browser-effective bank size

| Section | Original practice content | Displayed per attempt |
| --- | ---: | ---: |
| English | 150 questions across 20 passages | 50 |
| Mathematics | 140 questions across 70 two-item variant families | 45 |
| Reading | 117 questions across 13 passage sets | 36 |
| Science | 137 questions across 24 science sets | 40 |
| **Total** | **544 questions** | — |

These banks are still **release candidates, not released banks**. Their scale, automated quality, diversity, blueprint, scoring, session, build, and artifact gates are green, but independent clean-room content review and fresh naive-user review remain release blockers.

## Enhanced ACT structure modeled

| Section | Total items | Scored items | Embedded field-test | Time |
| --- | ---: | ---: | ---: | ---: |
| English | 50 | 40 | 10 | 35 min |
| Mathematics | 45 | 41 | 4 | 50 min |
| Reading | 36 | 27 | 9 | 40 min |
| Science (optional) | 40 | 34 | 6 | 40 min |

The Composite is based on English, Mathematics, and Reading. Science is optional in the modeled enhanced format and does not affect the Composite. When Science is taken, a separate STEM estimate is shown from Mathematics and Science.

The constrained engines model the current final enhanced blueprint: English uses 3 long + 2 short operational passages with current writing-type/content-domain rules; Reading uses 1 literary + 2 informational operational passages with 2 single + 1 paired-or-VQI unit; Science uses 2 Data Representation + 3 Research Summaries + 1 Conflicting Viewpoints operational sets with current reporting-category, format-item, content-area, engineering/design, and background-knowledge ranges. Math uses the final enhanced reporting-category composition, modeling minimum, variant exclusion, and increasing-difficulty ordering.

See [`OFFICIAL_ACT_SOURCES.md`](OFFICIAL_ACT_SOURCES.md) for the authoritative source snapshot verified August 21, 2026.

## Release-scale evidence

The current automated evidence is recorded in [`RELEASE_EVIDENCE_V1.md`](RELEASE_EVIDENCE_V1.md).

The audited production banks passed **5,000/5,000 forms per section**. Mean exact-item overlap across **5,000 independent retake pairs per section** was:

| Section | Mean overlap |
| --- | ---: |
| Mathematics | 32.7% |
| English | 34.0% |
| Reading | 30.8% |
| Science | 30.4% |

Project release target is ≤40% for each section.

The browser-effective answer-construction gates are also green: unique-longest-correct, prose correct-among-longest, correct-vs-distractor mean length, raw key balance, and stacked absolute-language checks.

## Estimated scores

This project **does provide an estimated ACT section score and estimated Composite score**. Estimates are intentionally labeled as such.

The scoring model uses the published raw-to-scale tables from official enhanced ACT Online Practice Tests 1 and 2. For a raw score, the UI shows the rounded mean estimate and the observed range across those two official practice-form tables. For a complete core full test, the Composite estimate is the rounded mean of English, Mathematics, and Reading estimates. Science is reported separately and, when taken, contributes with Mathematics to an estimated STEM score.

Real ACT forms are equated independently and this site's questions are original unofficial practice material. The result therefore must not be interpreted as an official ACT score prediction.

See [`SCORE_MODEL.md`](SCORE_MODEL.md).

## Development

Requires Node.js 22+.

```bash
npm test
npm run build
npm run check
```

The build outputs `_site/` for GitHub Pages. `npm run check` includes source tests, production build, artifact validation, the 5,000-form production blueprint audit, and the 5,000-pair retake-diversity gate.

## Release process

The governing quality rules are in [`CONTENT_STANDARDS.md`](CONTENT_STANDARDS.md) and the complete V1 gate is in [`ACT_RELEASE_CHECKLIST.md`](ACT_RELEASE_CHECKLIST.md).

Passing CI is necessary but not sufficient. Before promotion, the candidate still requires:

1. independent clean-room review of the entire browser-effective bank;
2. independent recomputation/fact checking and ambiguity review;
3. repair of any substantive findings;
4. a fresh from-scratch clean-room pass with zero substantive findings;
5. a fresh naive-user/accessibility review of the production artifact;
6. exact prospective-production-tree validation;
7. successful GitHub Pages deployment and public smoke test.

## Copyright and affiliation

Questions, passages, scenarios, and synthetic datasets in this repository are original practice material. Official ACT materials are used to verify structure and scoring data; secure/released ACT question wording is not copied into the practice bank.

This project is independent and is not affiliated with, endorsed by, sponsored by, or reviewed by ACT Education Corp. ACT is a trademark of ACT Education Corp.
