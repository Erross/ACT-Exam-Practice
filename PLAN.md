# ACT V1 Build and Release Plan

## Built and automated-gate complete

- [x] Establish neutral exam/section architecture.
- [x] Encode the current enhanced ACT counts, timing, scored/EFT split, and final section blueprints.
- [x] Independently reverify the February 2026 ACT Design Framework/current administration guidance.
- [x] Add estimated-score model grounded in two official enhanced ACT online-practice conversion tables.
- [x] Independently verify both stored raw→scale conversion tables against ACT's official scoring keys.
- [x] Build release-scale Math bank: 140 questions / 70 variant families.
- [x] Build release-scale English bank: 150 questions / 20 passages.
- [x] Build release-scale Reading bank: 117 questions / 13 passage sets.
- [x] Build release-scale Science bank: 137 questions / 24 science sets.
- [x] Add full ACT controller: English → Math → Reading → optional Science.
- [x] Add estimated Composite and STEM result views.
- [x] Add preflight, navigator, flags, submission review, answer explanations, responsive/accessibility first pass, and persisted session recovery.
- [x] Bring browser-effective answer-construction metrics inside release gates.
- [x] Run 5,000 production blueprint draws for each section.
- [x] Run 5,000 independent retake pairs for each section and hold all sections at ≤40% mean exact-item overlap.
- [x] Verify build and production-artifact completeness.
- [x] Record point-in-time automated evidence in `RELEASE_EVIDENCE_V1.md`.
- [x] Adopt mature ACT content standards and release checklist.

## Remaining release blockers

- [ ] Run independent clean-room audit across the **entire browser-effective 544-question bank**.
- [ ] Independently recompute all quantitative Math answers and all quantitative Science/Reading data questions.
- [ ] Independently review every English/Reading/Science item for ambiguity, factual correctness, distractor competitiveness, rationale accuracy, and passage/set self-consistency.
- [ ] Check whole-bank originality/provenance and duplicate/near-duplicate/variant behavior independently of existing tests.
- [ ] Repair every substantive clean-room finding and add regressions where appropriate.
- [ ] Restart the clean-room audit from scratch after repairs; require zero substantive findings on the final fresh pass.
- [ ] Run a fresh naive-user/accessibility assessment against the production artifact with no prior interface coaching.
- [ ] Repair any naive-review findings and repeat with a new assessor if the product is materially misunderstood.
- [ ] Update/finalize release evidence with clean-room and naive-review results.
- [ ] Validate the exact prospective production integration tree from current `main`.
- [ ] Merge only the fully reviewed candidate.
- [ ] Deploy through GitHub Pages and smoke-test the real public site.

PR #1 must remain draft until the remaining release blockers are complete.
