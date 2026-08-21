# ACT Exam Practice

A free, unofficial practice application for the **enhanced ACT**. The project is being built as a sibling to `Erross/AP-Exam-Practice`, but with a neutral exam/section architecture so both products can later be combined into a single application without rewriting their content banks.

## Current development status

`main` is intentionally minimal until the first release is ready. Active work is on feature branches.

The first development milestone provides:

- a static HTML/CSS/JavaScript application suitable for GitHub Pages;
- generic exam/section configuration rather than AP-specific assumptions;
- current enhanced-ACT section lengths and embedded field-test counts;
- an ACT Mathematics draw engine using the operational blueprint;
- 140 original draft Math questions across 70 variant families;
- hidden non-scored field-test items in each generated Math attempt;
- estimated 1–36 Math scoring using two official enhanced ACT practice-form conversion tables;
- category-level results;
- automated blueprint, scoring, bank-integrity, and build tests.

English, Reading, Science, and full-test orchestration are architecture-ready but **not released** until their banks meet the content and clean-room review standard.

## Enhanced ACT structure modeled

| Section | Total items | Scored items | Field-test items | Time |
| --- | ---: | ---: | ---: | ---: |
| English | 50 | 40 | 10 | 35 min |
| Mathematics | 45 | 41 | 4 | 50 min |
| Reading | 36 | 27 | 9 | 40 min |
| Science (optional) | 40 | 34 | 6 | 40 min |

The Composite is based on English, Mathematics, and Reading. Science is optional and does not affect the Composite.

## Score estimates

This project **does provide an estimated ACT section score and, once all core sections are released, an estimated Composite score**. Estimates are intentionally labeled as such.

The initial scoring model uses the published raw-to-scale tables from two official enhanced ACT online practice tests. For a given raw score, the UI shows the mean rounded estimate and the observed range across those two official practice forms. Real ACT forms are equated separately, so this cannot be an official score prediction.

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

A section is not released merely because it has enough questions. Before promotion it must pass:

1. authoritative blueprint verification;
2. bank/schema and constrained-draw tests;
3. answer/rationale and quantitative correctness review;
4. distractor, answer-position, duplicate/variant, and difficulty audits;
5. browser-effective parity checks;
6. independent clean-room review after repairs.

## Copyright and affiliation

Questions in this repository are original practice material. This project does not copy secure or released ACT questions.

This project is independent and is not affiliated with, endorsed by, sponsored by, or reviewed by ACT Education Corp. ACT is a trademark of ACT Education Corp.
