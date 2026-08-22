# ACT V1 Release Evidence

Status: **pre-production release gates complete; merge, GitHub Pages deployment, and live public smoke test remain**.

Evidence date: **August 21, 2026 (America/Chicago)**  
Audited implementation SHA: `4a43c3679b3aa24a35e0ca135a2738ca7b13c979`  
Validated prospective PR merge tree: `842efa4e9fc320d64d4a9156c7f0fb729b2cbb12`  
GitHub Actions Check run: `32545318021` (run #431)  
Result: **59/59 tests passed; production build passed; production artifact check passed; checked `_site/` artifact uploaded**.

The commits after the audited implementation SHA update only release documentation. The browser-effective application/bank reviewed below is unchanged by those documentation commits.

## 1. Current authoritative ACT specification

Independently reverified against ACT Education Corp. sources on August 21, 2026, using the February 2026 *Design Framework for the ACT Enhancements* as the governing blueprint plus current test-day, calculator, scoring, and enhanced-test guidance.

Verified browser-effective section model:

| Section | Displayed | Scored | EFT | Time |
| --- | ---: | ---: | ---: | ---: |
| English | 50 | 40 | 10 | 35 min |
| Mathematics | 45 | 41 | 4 | 50 min |
| Reading | 36 | 27 | 9 | 40 min |
| Science (optional) | 40 | 34 | 6 | 40 min |

Composite uses English + Mathematics + Reading. Science is separate and, when taken with Mathematics, contributes to a STEM score. Mathematics is the only calculator section. The real online ACT provides Desmos; this site deliberately does not claim to embed a calculator.

The source record is maintained in `OFFICIAL_ACT_SOURCES.md` and `official-sources.html`.

## 2. Browser-effective bank

| Section | Effective bank |
| --- | ---: |
| English | 150 questions across 20 original passages (10 long + 10 short) |
| Mathematics | 140 original questions across 70 two-item variant families |
| Reading | 117 questions across 13 original passage sets |
| Science | 137 questions across 24 original science sets |
| **Total** | **544 original practice questions** |

All effective question IDs are globally unique. The duplicate/near-duplicate screen excludes only intentionally grouped Math siblings and finds no accidental ungrouped duplicate/near-duplicate question fingerprints or duplicate stimuli.

## 3. Browser-effective answer-construction metrics

Latest validated metrics:

| Section | Uniquely-longest correct | Correct among longest | Correct mean words | Distractor mean words | Mean delta | Effective raw keys A/B/C/D |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Math | 0.7% | 83.6%* | 1.58 | 1.57 | 0.6% | 35 / 35 / 35 / 35 |
| English | 20.7% | 56.7% | 6.17 | 5.71 | 7.9% | 38 / 38 / 37 / 37 |
| Reading | 17.9% | 23.9% | 12.31 | 11.21 | 9.8% | 30 / 29 / 29 / 29 |
| Science | 10.9% | 46.7% | 8.16 | 7.66 | 6.5% | 35 / 34 / 34 / 34 |

*The “among longest” word-count metric is non-diagnostic for Math because numeric/expression options are commonly one token and therefore tied. Math remains subject to the unique-longest, mean-length parity, key-balance, duplicate, and absolute-language gates.

All prose sections remain inside the mature release thresholds.

## 4. Production-form blueprint evidence

The exact production banks were drawn **5,000 independently seeded times per section**:

- Math: **5,000/5,000 valid** — counts, EFT, reporting categories, modeling, variant exclusion, and increasing-difficulty ordering.
- English: **5,000/5,000 valid** — counts/EFT, passage length, writing type, content domain, categories, and intact passage sets.
- Reading: **5,000/5,000 valid** — counts/EFT, literary/informational mix, single/paired/VQI rules, passage length, categories, and intact passage sets.
- Science: **5,000/5,000 valid** — counts/EFT, DR/RS/CV, format-item ranges, content areas, engineering/design, categories, background knowledge, all-seven-set maxima, and intact sets.

## 5. Retake diversity — 5,000 independent pairs per section

Release target: **≤40% mean exact-item overlap**.

| Section | Mean exact overlap | Percent of delivered form | Result |
| --- | ---: | ---: | --- |
| Math | 14.72 / 45 | 32.7% | PASS |
| English | 16.99 / 50 | 34.0% | PASS |
| Reading | 11.10 / 36 | 30.8% | PASS |
| Science | 12.17 / 40 | 30.4% | PASS |

## 6. Estimated-score model provenance

The stored raw→scale arrays were independently compared with ACT's current enhanced Online Practice Test 1 and Online Practice Test 2 scoring/conversion tables for English (0–40), Math (0–41), Reading (0–27), and Science (0–34).

The product intentionally reports an **estimated** score and observed official-practice-table range rather than claiming an equated official score prediction. Composite uses English + Math + Reading only. Science is separate; when Science is taken, the product also reports a Math+Science STEM estimate. Composite/STEM ranges preserve official practice-form identity rather than mixing section minima/maxima from different forms.

See `SCORE_MODEL.md`.

## 7. Clean-room content audit

A complete browser-effective audit was performed without treating the PR description, existing tests, or prior release claims as proof of correctness. It reviewed/recomputed the displayed choices after every repair/normalization layer.

The first pass found and repaired:

1. one Math wording ambiguity (`M-IES-WORK-2`);
2. one accidental duplicate English question (`E-S2-Q1` / `E-S5-Q1`);
3. one Science release-layer distractor that created a second defensible answer (`S-CV-SEABREEZE-6`);
4. four English editing-direction precision defects (`E-L1-Q2`, `E-L1-Q4`, `E-L3-Q5`, `E-L3-Q8`);
5. one Reading release-layer distractor that was too defensible (`R-LIT-KILN-6`);
6. one Reading passage-length adjustment that added meaningless padding (`R-INFO-NOISE`).

Targeted regressions were added for the substantive findings. The complete Math bank was independently recomputed, Science numeric/data/mechanism items were checked against their effective stimuli/tables, English items were checked against the effective numbered passages, and Reading keys/rationales were checked against effective passage/data evidence.

After repairs, a **fresh reset pass** was run from the checked production artifact with prior audit conclusions deliberately withheld from the review criteria. Result: **0 new substantive findings** across the 544-question effective bank.

This is an agentic clean-room/reset review, not a claim of external human certification or ACT review.

## 8. Naive production-artifact UX review

The exact checked `_site/` artifact was assessed from the perspective of an unbriefed student seeking realistic unofficial ACT practice and an estimated score.

The assessment found and repaired a coordinated release batch:

- removed development/release-candidate wording from student-facing pages;
- protected existing saved attempts from silent replacement when starting a new test;
- changed misleading “Review & submit” wording to honest “Submit section” wording;
- clarified that the real online ACT provides Desmos but this practice site does **not** embed a calculator;
- added the ACT no-penalty-for-wrong-answers/answer-every-question guidance to preflight;
- added explicit visible feedback when time expiry caused automatic submission;
- clarified full-test scheduled-break guidance;
- added missing skip navigation to the official-source page;
- improved long-passage desktop usability with a wide split passage/question layout and stacked responsive fallback;
- marked all four V1 sections explicitly `released` in production configuration.

The follow-up artifact/browser-contract gate is green. A locally hosted Chromium visual walk-through could not be used because the execution environment blocks localhost/file navigation; therefore the **live public Pages smoke test remains the final visual/browser confirmation after deployment** rather than being falsely claimed here.

## 9. Session/build/artifact/integration evidence

Automated/browser-contract coverage includes:

- preflight before timer start;
- absolute-deadline timing and saved-attempt restoration;
- protection from accidental saved-attempt replacement;
- answer-choice shuffling with semantic-key preservation;
- question navigator and answered/current/flagged states;
- persisted review flags;
- explicit submit and unanswered/flagged warnings;
- timeout submission and timeout-result feedback;
- full-test order, total commitment, scheduled-break guidance, and between-section score hiding;
- answer-review data preserving displayed option order and scored/EFT status;
- form-consistent Composite/STEM result behavior;
- release-facing accessibility/DOM controls;
- source build to `_site/`;
- byte-for-byte browser module/data tree parity in the production artifact;
- public About/source/scope records.

The PR Check workflow tested the prospective merge commit `842efa4e9fc320d64d4a9156c7f0fb729b2cbb12`, which merged implementation head `4a43c3679b3aa24a35e0ca135a2738ca7b13c979` into current `main` (`cdce5b057efcf43ab33777cff1c55d3d1ec0bdbe`). That exact integration tree passed **59/59 tests + build + artifact check**.

## 10. Deployment gate

A GitHub Pages workflow is now included. It is modeled on the already-working AP Exam Practice Pages workflow, uses pinned GitHub action SHAs, runs `npm run check`, uploads only the checked `_site/` tree, and enables Pages through `actions/configure-pages`.

Remaining release actions are operational rather than content-quality gates:

1. merge the reviewed PR with an expected-head guard;
2. confirm merged `main` matches the validated candidate plus documentation-only release-record commits;
3. require the Pages workflow to succeed;
4. smoke-test the real public site, including Home/About/Official Sources and section/full-test launch flows.
