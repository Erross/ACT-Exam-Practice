# ACT Content Authoring Standards

This document is the source of truth for ACT question-bank quality. A new or materially revised ACT bank is not release-ready merely because it runs or its own tests pass. It must also satisfy [`ACT_RELEASE_CHECKLIST.md`](ACT_RELEASE_CHECKLIST.md).

The browser-effective bank—the content students actually receive after aggregation, repair overlays, answer-position normalization, and runtime drawing—is the thing being released.

## 1. Verify the current official ACT specification

Do not build from memory, prior repository claims, or old practice materials.

- Independently check the current ACT exam information and the governing **Design Framework for the ACT Enhancements** or later official replacement.
- Record the verification date and official source set in [`OFFICIAL_ACT_SOURCES.md`](OFFICIAL_ACT_SOURCES.md), and keep `official-sources.html` consistent with it.
- Verify displayed/scored/EFT question counts, timing, optional-section rules, calculator policy, Composite/STEM rules, reporting-category ranges, passage/set counts and types, passage lengths, Math difficulty ordering, Science content-area constraints, and background-knowledge expectations.
- Treat redesign effective dates explicitly. State/district, national, online, and paper guidance can have transition periods.
- If the governing blueprint is uncertain or authoritative sources conflict materially, stop and resolve that uncertainty before changing the bank.

## 2. Originality and provenance

- Every question, passage, scenario, and synthetic dataset in this repository must be original practice material unless a source is explicitly identified and legally reusable.
- Do not reproduce secure, released, or publicly posted ACT question wording merely because it is accessible.
- Official ACT materials may be used to verify structure, skills, style, and factual scoring tables—not copied as the practice bank.
- Synthetic data must not be presented as published experimental evidence.
- Provenance claims must never imply ACT authorship, review, sponsorship, or endorsement of this project.

## 3. Item schema and scoring integrity

Every browser-effective item must have:

- a stable globally unique ID;
- the correct ACT section and reporting category;
- exactly four distinct choices;
- exactly one unambiguous semantic key;
- an item-specific rationale;
- intact passage/set metadata where applicable;
- a difficulty tag and variant-family tag where the section model requires them.

Runtime choice shuffling must preserve the semantic correct answer. Field-test items must never be identified to the student during an attempt and must never contribute to the scored raw result.

## 4. Correct answers and distractors

- Every keyed answer must be independently defensible from the stem, stimulus, and relevant domain knowledge.
- Every distractor must actually be wrong under the question as written.
- Distractors should represent plausible misconceptions, incorrect inferences, common calculation errors, or competing interpretations—not joke answers or malformed filler.
- Avoid hidden assumptions, undefined terminology, and questions with multiple defensible answers.
- A rationale should explain why the answer follows and, where useful, why the strongest competing interpretation fails.

### Statistical-tell limits

Automated checks on the browser-effective banks enforce mature release-style limits:

- uniquely longest correct option: **≤25%**;
- correct option among the longest for prose-heavy sections: **≤58%**;
- mean correct-answer word count versus distractors: within **12%**;
- raw key positions for four-option banks: each slot **15–35%**;
- no stacking multiple conspicuous `always / never / only / entirely / unlimited / impossible / guarantee / must`-style distractors in one item.

The “correct among longest” word-count metric is not used for ACT Math because most Math choices are one-token numbers or expressions and ties dominate that statistic. Math still must pass the unique-longest, mean-length, key-position, and absolute-language gates.

Do not weaken a gate merely to make a failing bank pass. Fix the content or document a principled metric exception.

## 5. Quantitative and factual correctness

- Independently recompute every calculation-based answer during clean-room review.
- Check units, signs, rounding, ratios, denominators, graph/table readings, algebraic equivalence, and whether a claimed trend is actually supported.
- Science conclusions must not overstate what the synthetic experiment or table establishes.
- Background-knowledge items must use accurate mainstream science, not oversimplified mechanisms that become false.
- Fact-check time-sensitive policy or exam claims against current authoritative ACT sources.
- Add a regression test for substantive quantitative/factual defects found during review where practical.

## 6. Passage, set, and structured-data fidelity

English, Reading, and Science content is atomic at the passage/set level.

- Passage/set questions must remain together and share operational/EFT status.
- English and Reading text must remain inside the reviewed enhanced-ACT word bands used by the project.
- Reading paired/VQI constraints and Science DR/RS/CV constraints apply to the whole delivered form.
- Structured Reading VQI and Science Data Representation material must render once, legibly, with captions/headers and without duplicated raw numeric rows in browser prose.
- Browser display text, structured tables, question stems, and rationales must agree with one another.
- Do not silently rely on a source file being correct if an aggregation or repair layer changes what the browser receives.

## 7. Duplicate and retake control

### Within an attempt

- Math variant-family siblings may not appear together.
- Passage/set material must remain atomic.
- Near-duplicate scenarios across the effective bank should be consolidated or explicitly grouped when they would make one attempt repetitive.

### Across attempts

Retakes must provide materially different practice. Measure this rather than assuming bank size is sufficient.

Run **5,000 independent attempt pairs per section** and report mean exact-question overlap. Release target: **≤40%** for every section.

## 8. Blueprint verification

The ordinary section tests provide fast regressions, but release evidence uses the actual production banks.

Run at least **5,000 independently seeded production forms per section** and assert every current enhanced-ACT constraint, including:

- displayed, scored, and EFT counts;
- reporting-category requirements;
- whole-passage/set integrity;
- Math modeling minimum, variant exclusion, and nondecreasing difficulty order;
- English long/short, writing-type, and content-domain constraints;
- Reading literary/informational, single/paired/VQI, and passage-length constraints;
- Science DR/RS/CV mix, format-item ranges, content areas, engineering/design range, background-knowledge range, and all-seven-set content maxima.

The 5,000-form audit complements rather than replaces exact unit tests.

## 9. Estimated-score model

V1 intentionally provides estimated section scores and an estimated Composite.

- Raw-to-scale conversion arrays must be independently checked against the current official ACT practice-test scoring keys named in [`SCORE_MODEL.md`](SCORE_MODEL.md).
- The product must label its result **estimated** and must not imply that an unofficial raw score has an exact official ACT conversion.
- The displayed estimate/range may use variation among official practice-form tables, but the method must remain documented and tested.
- Composite uses English, Math, and Reading under the current enhanced-ACT rule. Science is separate and contributes with Math to the displayed STEM estimate when Science is taken.

## 10. Browser/session/accessibility behavior

Release review must cover the real student workflow, not only pure functions.

- Preflight appears before the timer starts.
- The timer uses an absolute deadline and does not reset on refresh/recovery.
- Answering, changing answers, navigator jumps, flags, submission, timeout, and saved-session restoration work.
- Full-test section scores remain hidden until the full attempt ends.
- Answer review preserves the actual displayed answer order and rationales.
- Keyboard/focus behavior, accessible labels, tables, skip navigation, and responsive layout are usable.
- Writing is clearly identified as outside V1 scope.
- The student can understand the unofficial/original/estimated nature of the product without coaching.

## 11. Production artifact parity

A correct source tree is insufficient if the built site differs.

- `npm run check` must pass from the exact candidate tree.
- `_site/` must contain all browser modules, data, public source records, and required static assets.
- The production artifact must load the same browser-effective banks and configuration that were audited.
- After deployment, smoke-test the public site, not only the build artifact.

## 12. Independent clean-room review

A reviewer/session that did not author the content must independently re-check:

- current official blueprint and scoring semantics;
- every browser-effective answer for correctness/ambiguity;
- distractor competitiveness;
- quantitative and factual correctness;
- source/provenance/originality claims;
- duplicate/variant handling across the whole effective bank;
- passage/data/table self-consistency;
- student-facing UX and trust/scope comprehension.

Use **audit → repair → restart from scratch**. A list of repaired findings is not equivalent to a fresh clean pass. Release target: **zero substantive findings on a fresh post-repair review**.

A separate fresh naive assessor should be able to start and complete realistic ACT practice, understand full-test versus section practice, use navigation/flags/review, and interpret the estimated score without prior coaching.

## 13. Promotion rule

Keep PRs/branches draft until the complete release gate passes. Passing CI is necessary but not sufficient.

Only promote after:

1. authoritative source snapshot is current;
2. release-scale bank and automated evidence are green;
3. independent clean-room audit is clean after any repair cycle;
4. naive-user/accessibility review is clean;
5. the exact prospective production tree passes the complete gate;
6. GitHub Pages deployment from `main` succeeds and the public site is smoke-tested.
