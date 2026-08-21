# Estimated ACT Score Model

The product must show an **Estimated ACT Score** while avoiding false precision.

## Method

For each enhanced ACT section, the repository stores the raw-to-scale conversion tables published with two official ACT online practice tests. Given a raw score:

1. convert the raw score using each official practice-form table;
2. take the rounded mean as the displayed estimate;
3. display the minimum–maximum across the two tables as an observed official-practice-form range.

When English, Math, and Reading are all available, the estimated Composite is the rounded arithmetic mean of their estimated section scores, matching the enhanced ACT Composite structure.

## Why this is an estimate

ACT equates operational test forms. The same raw score can map to different 1–36 scores on different forms, and the questions in this repository are original unofficial practice material rather than calibrated ACT items. Therefore the UI must always use **estimated**, never "official," "predicted official score," or equivalent language.

## Field-test items

The enhanced ACT presents more questions than contribute to the raw score. Practice attempts also include hidden field-test items and exclude them from raw-score calculation.

## Sources used for the initial model

- ACT Online Practice Test Scoring Key and Conversion Tables (enhanced ACT)
- ACT Online Practice Test 2 Scoring Key (enhanced ACT)

The tables are factual score-conversion data; no ACT question text is copied into this repository.
