# ACT V1 Release Checklist

Use this checklist for the first ACT release and for later material revisions. A bank is not release-ready merely because it exists, reaches a target question count, or passes its own tests.

## 1. Current official specification

- [ ] Current ACT exam/section information independently checked.
- [ ] Governing enhanced-ACT Design Framework/current replacement independently checked.
- [ ] Verification date and sources recorded in `OFFICIAL_ACT_SOURCES.md`.
- [ ] Public `official-sources.html` exposes the same current source set.
- [ ] English/Math/Reading/Science displayed, scored, EFT counts and timing verified.
- [ ] Science optionality and Writing scope accurately described for the target administration context.
- [ ] Calculator policy and online embedded-calculator statement verified.
- [ ] Current Composite and STEM definitions verified.
- [ ] Reporting-category, passage/set, passage-length, Math difficulty, and Science content constraints verified.

**Stop if the official blueprint is uncertain.**

## 2. Effective bank and originality

- [ ] Review the browser-effective aggregate, not only individual source files.
- [ ] All IDs globally unique.
- [ ] Four distinct choices and exactly one semantic key per item.
- [ ] All bank material original/synthetic or explicitly and lawfully sourced.
- [ ] No secure/released ACT question wording copied into the bank.
- [ ] Passage/set metadata complete and internally consistent.
- [ ] Math variant families prevent siblings in one attempt.
- [ ] Structured Reading/Science data agree with stems, answers, and browser prose.

## 3. Item-quality audit

- [ ] Every answer independently reviewed for correctness and ambiguity.
- [ ] Every distractor is actually wrong and plausibly competitive.
- [ ] Rationales are item-specific and teach the relevant reasoning.
- [ ] Quantitative Math answers independently recomputed.
- [ ] Quantitative Science/Reading table questions independently recomputed.
- [ ] Science mechanisms/background-knowledge claims independently fact-checked.
- [ ] English grammar/usage answers checked against the sentence/passage actually displayed.
- [ ] Reading claims/inferences checked directly against the displayed text/data.

### Browser-effective tell gates

- [ ] Uniquely longest correct ≤25%.
- [ ] Prose-section correct-among-longest ≤58%.
- [ ] Correct/distractor mean word-length delta ≤12%.
- [ ] Four raw key positions each 15–35%.
- [ ] No stacked conspicuous absolute-language distractors.

## 4. Production-form blueprint evidence

Run the exact candidate through at least **5,000 independently seeded forms per section**.

- [ ] Math 5,000/5,000 valid.
- [ ] English 5,000/5,000 valid.
- [ ] Reading 5,000/5,000 valid.
- [ ] Science 5,000/5,000 valid.
- [ ] EFT items remain intact/hidden and excluded from raw scoring.
- [ ] Math modeling, variant exclusion, and nondecreasing difficulty order pass.
- [ ] English long/short, writing-type, content-domain, and reporting-category constraints pass.
- [ ] Reading literary/informational, single/paired/VQI, length, and reporting-category constraints pass.
- [ ] Science format, format-item, reporting-category, content-area, engineering/design, background-knowledge, and all-seven-set maxima pass.

## 5. Retake diversity

Run **5,000 independent attempt pairs per section**.

- [ ] Math mean exact-item overlap ≤40%.
- [ ] English mean exact-item overlap ≤40%.
- [ ] Reading mean exact-item overlap ≤40%.
- [ ] Science mean exact-item overlap ≤40%.

Record actual percentages in release evidence.

## 6. Estimated-score model

- [ ] Official Practice Test 1 raw→scale tables independently checked against repository arrays.
- [ ] Official Practice Test 2 raw→scale tables independently checked against repository arrays.
- [ ] Score mapping is monotonic and bounded 1–36.
- [ ] Field-test items excluded from raw score.
- [ ] Composite uses English + Math + Reading only.
- [ ] Science is shown separately and contributes with Math to STEM when present.
- [ ] UI consistently says **estimated**, not official/predicted official score.
- [ ] The practice-form range/disclaimer is understandable without coaching.

## 7. Browser/session/UX gate

### Home and preflight

- [ ] Individual English, Math, Reading, and optional Science are easy to find.
- [ ] Full core ACT and core + Science choices are clear.
- [ ] Question counts, timing, scored/EFT explanation, Science optionality, calculator rule, and score-estimate caveat are understandable.
- [ ] Timer does not begin before explicit preflight confirmation.
- [ ] Writing is clearly outside V1 scope.

### During practice

- [ ] First item renders correctly in every section.
- [ ] English/Reading passage text remains readable while answering its questions.
- [ ] Reading VQI and Science DR tables render legibly and exactly once.
- [ ] Answer/change-answer works.
- [ ] Previous/Next and direct navigator jumps work.
- [ ] Answered/current/flagged navigator states are accurate and accessible.
- [ ] Flag state persists through navigation and refresh restoration.
- [ ] Absolute-deadline timer survives refresh without resetting.
- [ ] Timeout submits automatically.
- [ ] Early submission warns about unanswered/flagged questions.

### Full test and results

- [ ] Full-test sections run English → Math → Reading → optional Science.
- [ ] Section scores stay hidden between sections.
- [ ] Resume works during a section and between full-test sections.
- [ ] Final Composite/range display is understandable.
- [ ] Science is clearly excluded from Composite.
- [ ] STEM is shown only when Science is taken.
- [ ] Answer review preserves displayed option order, selected/correct choices, scored/EFT status, and rationale.
- [ ] Student can return home cleanly after results.

### Accessibility / responsive

- [ ] Skip link works.
- [ ] Keyboard-only navigation is usable.
- [ ] Focus moves sensibly across view changes.
- [ ] Timer and navigator have meaningful accessible semantics.
- [ ] Tables use captions/headers and remain usable on narrow screens.
- [ ] Mobile/narrow layout keeps question, passage, controls, and navigator comprehensible.

## 8. Build and artifact parity

- [ ] `npm run check` passes on the exact candidate SHA.
- [ ] `_site/` build succeeds.
- [ ] Production artifact contains all required JS/data/source/static files.
- [ ] Production artifact contains the same 544-question effective bank audited in source.
- [ ] Public About/source/scope language matches the candidate.

## 9. Independent clean-room review

A reviewer/session that did **not** author the bank independently verifies:

- [ ] official blueprint and current-policy semantics;
- [ ] answer correctness and ambiguity across the entire effective bank;
- [ ] distractor competitiveness;
- [ ] quantitative and factual correctness;
- [ ] originality/provenance claims;
- [ ] duplicate/variant behavior across the whole bank;
- [ ] passage/data/table self-consistency;
- [ ] browser/session behavior against the production artifact.

Use **audit → repair → restart from scratch**. Release target: **0 substantive findings on a fresh final pass**.

## 10. Fresh naive assessor

Give an assessor who has not been briefed on the interface only:

> You want realistic unofficial ACT practice and an estimated score. Use this site.

Without coaching they should be able to:

- [ ] identify section versus full-test practice;
- [ ] understand timing and Science optionality;
- [ ] understand that Writing is not provided;
- [ ] start the intended test without accidentally starting the timer early;
- [ ] answer, navigate, flag, resume, and submit;
- [ ] understand the estimated Composite and its limitations;
- [ ] understand that the site is original/unofficial and not ACT Education Corp.

If the product is materially misunderstood, fix the UX and restart with a **new** naive assessor.

## 11. Promotion / exact-tree validation

Only after all gates above pass:

- [ ] Keep PR #1 draft until clean-room + naive review are complete.
- [ ] Create a fresh integration/release candidate from current `main`.
- [ ] Bring in only the reviewed candidate changes.
- [ ] Run the complete gate on the exact prospective production tree.
- [ ] Confirm source records and public source page remain current.
- [ ] Confirm About/README/scope language remains accurate.
- [ ] Merge only if base/head still match the tested tree.
- [ ] Verify resulting `main` tree matches the validated prospective tree.

## 12. Deployment

- [ ] GitHub Pages build/deployment succeeds from the exact merged `main`.
- [ ] Public site loads with no missing modules/assets.
- [ ] Public Home → preflight → first question works for each section.
- [ ] Full-test start works.
- [ ] Save/resume, navigation, flags, submit, results, and explanations work on production.
- [ ] Public Official Sources/About pages are current.

If deployment fails after merge, treat production as impaired and repair it through a focused branch rather than assuming Pages will recover on its own.
