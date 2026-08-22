# Estimated ACT Score Model

Last independently reverified: **August 21, 2026**.

V1 must show an **Estimated ACT Score** while avoiding false precision. The questions in this repository are original unofficial practice items and are not psychometrically equated ACT forms.

## Official conversion sources

The repository stores raw-to-scale conversion tables published by ACT Education Corp. for two current enhanced online practice tests:

- **ACT Online Practice Test 1 Scoring Key and Conversion Tables**  
  https://www.act.org/content/dam/act/unsecured/documents/ACT-National-Online-Practice-Test-1-Scoring-Key-and-Conversion-Tables.pdf
- **ACT Online Practice Test 2 Scoring Key**  
  https://www.act.org/content/dam/act/unsecured/documents/ACT-Nat-Online-Practice-Test-2-Scoring-Key.pdf

On August 21, 2026, the English, Math, Reading, and Science raw→scale arrays in `js/core/scoring.js` were independently compared with both official ACT tables and matched them.

Official maximum scored raw values represented by the tables are:

| Section | Maximum scored raw |
| --- | ---: |
| English | 40 |
| Mathematics | 41 |
| Reading | 27 |
| Science | 34 |

Embedded field-test items are displayed during practice but excluded from the raw score, matching the structure represented in ACT's official enhanced practice scoring materials.

## Section-estimate method

For a section raw score:

1. convert the raw score using official Practice Test 1's table;
2. convert the same raw score using official Practice Test 2's table;
3. display the rounded arithmetic mean of those two scale scores as the central **estimate**;
4. display the minimum–maximum of the two official-practice conversions as the observed practice-form range.

The resulting scale is bounded 1–36 and the stored tables are monotonic.

## Composite estimate

Under the current enhanced ACT model, the Composite uses **English, Mathematics, and Reading**. The application therefore computes:

```text
estimated Composite = round((estimated English + estimated Math + estimated Reading) / 3)
```

A Composite is withheld until all three core section estimates exist.

Science does **not** enter the enhanced Composite. If Science is taken, its estimated section score is shown separately and the application reports a separate estimated STEM score based on Mathematics and Science.

## Why this must remain an estimate

ACT equates operational test forms. The same raw score can map to different 1–36 scale scores on different forms because form difficulty is adjusted through equating. ACT's own practice materials illustrate this by publishing form-specific raw→scale conversions.

This project's questions have not been calibrated or equated by ACT. Therefore the UI must use language such as:

- **Estimated ACT Composite**
- **Estimated Mathematics score**
- **Official practice-form conversions for this raw score span 25–27**

It must not use language such as:

- official ACT score;
- guaranteed ACT score;
- exact predicted ACT score;
- equivalent to an ACT-administered result.

The range is evidence of variation in the two official practice-form conversion tables, not a statistical confidence interval and not a guarantee that an operational ACT form would fall inside it.

## Validation requirements

Before release and after any scoring-source change:

- independently compare every stored conversion entry with the current named ACT scoring PDFs;
- confirm raw-score array lengths still match scored question counts;
- test monotonicity and 1–36 bounds;
- test field-test exclusion;
- test current Composite semantics;
- verify Science/STEM wording against current ACT guidance;
- ensure results pages still visibly label scores as estimated/unofficial.

See `RELEASE_EVIDENCE_V1.md` for the August 21, 2026 verification record.
