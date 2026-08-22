# ACT V1 Build and Release Plan

## Complete before promotion

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
- [x] Add preflight, navigator, flags, submission warnings, answer explanations, responsive/accessibility behavior, and persisted session recovery.
- [x] Bring browser-effective answer-construction metrics inside release gates.
- [x] Run 5,000 production blueprint draws for each section.
- [x] Run 5,000 independent retake pairs for each section and hold all sections at ≤40% mean exact-item overlap.
- [x] Verify build and production-artifact completeness.
- [x] Run a complete clean-room audit across the browser-effective 544-question bank.
- [x] Independently recompute the complete Math bank and quantitative Science/Reading data questions.
- [x] Review English/Reading/Science for ambiguity, factual correctness, distractor competitiveness, rationale accuracy, and passage/set self-consistency.
- [x] Check whole-bank duplicate/near-duplicate/variant behavior and originality/provenance assumptions independently of bank-local tests.
- [x] Repair all substantive clean-room findings and add targeted regressions.
- [x] Restart the clean-room audit against the repaired effective artifact; zero new substantive findings.
- [x] Run a naive production-artifact UX/accessibility assessment with no interface coaching.
- [x] Repair naive-review findings: saved-attempt protection, calculator wording, guessing guidance, timeout feedback, submit labels, production copy, skip navigation, and desktop passage layout.
- [x] Validate the exact prospective production integration tree against current `main`; the PR merge tree passed the full release gate.
- [x] Add GitHub Pages deployment from checked `_site/` using the same pinned-action pattern as the working AP practice repository.
- [x] Finalize pre-production release evidence and PR description.

## Promotion / production

- [ ] Merge the fully reviewed PR into `main` with an expected-head guard.
- [ ] Confirm the resulting `main` tree matches the validated candidate plus release-record documentation.
- [ ] Confirm GitHub Pages deployment succeeds from merged `main`.
- [ ] Smoke-test the public Home/About/Official Sources pages and section/full-test launch flows.
- [ ] Record the final production URL and deployment result.

The reusable quality requirements remain in `ACT_RELEASE_CHECKLIST.md`; point-in-time evidence is in `RELEASE_EVIDENCE_V1.md`.
