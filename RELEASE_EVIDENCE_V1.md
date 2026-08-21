# ACT V1 Release Evidence

Status: **automated release-scale evidence complete; independent clean-room and naive-user release gates still pending**.

Evidence date: **August 21, 2026 (America/Chicago)**  
Audited implementation SHA: `17749b60b48f5280ef190141aa209ede56e8c138`  
GitHub Actions Check run: `32538639446` (run #347)  
Result: **44/44 tests passed; production build passed; production artifact check passed**.

This record captures point-in-time evidence. Do not rewrite these measurements to match a later bank or exam cycle; create new evidence for materially changed candidates.

## 1. Current authoritative ACT specification

Independently reverified against ACT Education Corp. sources on August 21, 2026:

- Design Framework for the ACT Enhancements — February 2026  
  https://www.act.org/content/dam/act/unsecured/documents/R2519-Design-Framework-for-the-ACT-Enhancements-2026-02.pdf
- ACT Information for Examinees / enhanced state and district section timing  
  https://www.act.org/content/act/en/products-and-services/state-and-district-solutions/act-info-for-examinees.html
- Enhanced ACT K-12 guidance / Composite and Science optionality transition  
  https://www.act.org/content/act/en/products-and-services/the-act-educator/the-act-test/enhancements-k12.html
- Current calculator policy  
  https://www.act.org/content/act/en/products-and-services/the-act/test-day/calculator-policy.html

Verified browser-effective section model:

| Section | Displayed | Scored | EFT | Time |
| --- | ---: | ---: | ---: | ---: |
| English | 50 | 40 | 10 | 35 min |
| Mathematics | 45 | 41 | 4 | 50 min |
| Reading | 36 | 27 | 9 | 40 min |
| Science (optional) | 40 | 34 | 6 | 40 min |

Composite uses English + Mathematics + Reading. Science is separate and, when taken with Math, contributes to a STEM score.

The February 2026 framework was also independently checked for final passage/set/category constraints, including the revised enhanced Science reporting-category name **Evaluating Scientific Arguments and Models with Evidence**.

## 2. Browser-effective bank

| Section | Effective bank |
| --- | ---: |
| English | 150 questions across 20 original passages (10 long + 10 short) |
| Mathematics | 140 original questions across 70 two-item variant families |
| Reading | 117 questions across 13 original passage sets |
| Science | 137 questions across 24 original science sets |
| **Total** | **544 original practice questions** |

All effective question IDs were globally unique and all effective items passed the repository schema gate.

## 3. Browser-effective answer-construction metrics

Measured on the effective aggregated banks after quality repairs and key-position normalization:

| Section | Uniquely-longest correct | Correct among longest | Correct mean words | Distractor mean words | Mean delta | Effective raw keys A/B/C/D |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Math | 0.7% | 83.6%* | 1.58 | 1.57 | 0.6% | 35 / 35 / 35 / 35 |
| English | 20.7% | 56.7% | 6.17 | 5.71 | 7.9% | 38 / 38 / 37 / 37 |
| Reading | 17.9% | 24.8% | 12.31 | 11.20 | 9.9% | 30 / 29 / 29 / 29 |
| Science | 10.9% | 46.7% | 8.16 | 7.66 | 6.5% | 35 / 34 / 34 / 34 |

*The “among longest” word-count metric is non-diagnostic for Math because numeric/expression options are commonly one token and therefore tied. Math still passed unique-longest, mean-length parity, raw-key balance, and absolute-language gates.

All sections passed:

- uniquely-longest correct ≤25%;
- prose correct-among-longest ≤58%;
- correct/distractor mean word-length delta ≤12%;
- every effective raw key position within 15–35%;
- no question with multiple conspicuous absolute-language distractors.

## 4. 5,000-form production blueprint audit

The release audit drew **5,000 independently seeded forms from each actual production bank**.

- Math: **5,000/5,000 valid** — displayed/scored/EFT counts, reporting categories, modeling minimum, variant-family exclusion, and nondecreasing difficulty order.
- English: **5,000/5,000 valid** — counts/EFT, long/short structure, writing types, content-domain maxima, reporting categories, and intact passage status.
- Reading: **5,000/5,000 valid** — counts/EFT, literary/informational mix, single/paired/VQI rules, length mix, categories, and intact passage status.
- Science: **5,000/5,000 valid** — counts/EFT, DR/RS/CV mix, format-item ranges, content areas, engineering/design, reporting categories, background knowledge, all-seven-set content maxima, and intact set status.

The ordinary faster section-specific regression tests also remained green.

## 5. Retake diversity — 5,000 independent pairs per section

Release target: **≤40% mean exact-item overlap**.

| Section | Mean exact overlap | Percent of delivered form | Result |
| --- | ---: | ---: | --- |
| Math | 14.72 / 45 | 32.7% | PASS |
| English | 16.99 / 50 | 34.0% | PASS |
| Reading | 11.10 / 36 | 30.8% | PASS |
| Science | 12.17 / 40 | 30.4% | PASS |

All four banks therefore clear the same release-scale retake threshold.

## 6. Estimated-score model provenance

Independently reverified on August 21, 2026 against ACT's official enhanced online-practice scoring keys:

- Online Practice Test 1 Scoring Key and Conversion Tables  
  https://www.act.org/content/dam/act/unsecured/documents/ACT-National-Online-Practice-Test-1-Scoring-Key-and-Conversion-Tables.pdf
- Online Practice Test 2 Scoring Key  
  https://www.act.org/content/dam/act/unsecured/documents/ACT-Nat-Online-Practice-Test-2-Scoring-Key.pdf

The repository raw→scale arrays match the official practice tables for English (0–40), Math (0–41), Reading (0–27), and Science (0–34).

The product intentionally reports an **estimated** score and official-practice-table range rather than claiming an exact official prediction. The full-test Composite uses the rounded mean of estimated English, Math, and Reading section scores. Science does not enter the Composite; when Science is taken, the product separately reports the Math+Science STEM estimate.

## 7. Browser/session/build evidence already green

Automated/browser-contract tests cover:

- preflight before timer start;
- absolute-deadline timing and saved-attempt restoration;
- answer-choice shuffling with semantic-key preservation;
- question navigator and answered/current/flagged states;
- persisted review flags;
- explicit submit and unanswered/flagged warnings;
- timeout submission;
- full-test order and between-section score hiding;
- answer-review data preserving displayed option order and scored/EFT status;
- Composite/STEM result behavior;
- required browser DOM/accessibility controls;
- source build to `_site/`;
- production artifact completeness and public authoritative-source record.

## 8. Gates still open

This evidence **does not authorize release by itself**. PR #1 must remain draft until:

1. a reviewer/session that did not author the content independently audits the entire browser-effective bank for answer correctness, ambiguity, distractor quality, calculations, factual claims, provenance/originality, and cross-bank duplicates/variants;
2. any substantive findings are repaired;
3. the clean-room audit restarts from scratch and reaches **0 substantive findings**;
4. a fresh naive assessor completes the real production-artifact workflow without coaching and understands section/full-test choice, timing, Science optionality, Writing exclusion, navigation/flags/resume/submission, and estimated-score limitations;
5. the exact prospective production integration tree passes the complete gate;
6. GitHub Pages deployment succeeds from the exact merged `main` and the public site is smoke-tested.
