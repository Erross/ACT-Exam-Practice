# Official ACT Sources

Last independently verified: **August 21, 2026**.

These are the authoritative ACT Education Corp. sources used to define the browser-effective exam model. Release review must re-check them rather than relying on repository metadata or prior audit claims.

## Governing design source

- **Design Framework for the ACT Enhancements (February 2026)**  
  https://www.act.org/content/dam/act/unsecured/documents/R2519-Design-Framework-for-the-ACT-Enhancements-2026-02.pdf

This is the governing source for final enhanced-ACT operational blueprints, passage/set structure, reporting-category ranges, Mathematics difficulty ordering, and Science passage/content constraints.

## Current format and policy sources

- **ACT information for examinees / enhanced ACT section lengths**  
  https://www.act.org/content/act/en/products-and-services/state-and-district-solutions/act-info-for-examinees.html
- **ACT calculator policy**  
  https://www.act.org/content/act/en/products-and-services/the-act/test-day/calculator-policy.html
- **Understanding ACT scores**  
  https://www.act.org/content/act/en/products-and-services/the-act/scores/understanding-your-scores.html
- **Enhanced ACT FAQ**  
  https://www.act.org/content/act/en/products-and-services/the-act-educator/the-act-test/enhancements-k12/faqs.html

## Verified implementation snapshot

| Section | Displayed | Scored | Embedded field-test | Time |
| --- | ---: | ---: | ---: | ---: |
| English | 50 | 40 | 10 | 35 min |
| Mathematics | 45 | 41 | 4 | 50 min |
| Reading | 36 | 27 | 9 | 40 min |
| Science (optional) | 40 | 34 | 6 | 40 min |

The ACT Composite uses English, Mathematics, and Reading. Science is optional and does not enter the Composite. When Science is taken, ACT also reports a STEM score derived from Mathematics and Science.

### English

- Reporting categories: Production of Writing 15–17; Knowledge of Language 7–9; Conventions of Standard English 15–17.
- Five operational passages totaling approximately 1,390 standard words: three approximately 340-word passages with 10 items each and two approximately 185-word passages with 5 items each.
- Writing types: 2–3 informational, 1–2 argumentative, exactly 1 narrative.
- Subject/content genre is a separate dimension; no more than two operational passages should share one content genre.
- Embedded field-test material is either one long 10-item passage or two short 5-item passages.

### Mathematics

- 41 scored items plus 4 embedded field-test items; 45 displayed in 50 minutes.
- Preparing for Higher Mathematics: Number & Quantity 4–5; Algebra 7–8; Functions 7–8; Geometry 7–8; Statistics & Probability 5–6.
- Integrating Essential Skills: 8.
- Modeling: at least 8 operational items, overlapping the reporting categories above.
- The displayed section is ordered in increasing difficulty.
- Calculators are permitted only on Mathematics. Online ACT testing provides an embedded Desmos graphing calculator; all problems can be solved without a calculator.

### Reading

- Reporting categories: Key Ideas & Details 12–14; Craft & Structure 7–9; Integration of Knowledge & Ideas 5–7.
- Three operational passages, each with 9 items: one literary narrative and two informational passages.
- Approximately two 750-word passages and one 650-word passage, about 2,150 operational words total.
- Two operational units are single passages; the third is paired or Visual and Quantitative Information (VQI).
- With the EFT unit included, a displayed form may contain both paired and VQI material, but not two paired units or two VQI units.
- VQI material uses one or more graphics such as a table, process diagram, or bar graph.

### Science

- Reporting categories: Interpretation of Data 13–17; Scientific Investigation 6–11; Evaluation of Models, Inferences, and Experimental Results 8–13.
- Six operational passages plus one EFT passage; 34 scored plus 6 embedded field-test items.
- Operational passage formats: 2 Data Representation, 3 Research Summaries, 1 Conflicting Viewpoints.
- Operational item ranges by format: DR 10–12; RS 16–20; CV 6–7.
- Primary content: Life Science exactly 2 passages; Earth/Space 1–2; Physics 1–2; Chemistry 1–2.
- Engineering/design is a secondary code on 1–3 operational passages, not a fifth primary domain.
- Approximately 5–8 items require outside/background scientific knowledge.
- Including the EFT passage, Life Science is capped at 3 passages and each other primary content area at 2.

## Release rule

If these authoritative sources change, the affected implementation and tests must be reverified before a draft section is promoted. A passing old test suite is not evidence that the current ACT specification is unchanged.
