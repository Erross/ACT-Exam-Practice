# Architecture

The repository is deliberately exam-family neutral at the engine boundary.

```text
Exam
  ├─ metadata / scoring policy
  └─ Sections[]
       ├─ timing
       ├─ operational blueprint
       ├─ embedded field-test count
       ├─ content bank
       └─ draw/result behavior
```

`js/config.js` describes the exam and sections. `js/core/` contains reusable selection, randomization, scoring, and session primitives. `data/` contains exam-family content only.

The intended future combined product can therefore mount AP and ACT registries behind one catalog instead of merging two divergent applications.

## Important ACT-specific behavior

The enhanced ACT includes embedded field-test items. They appear to students as ordinary questions but do not contribute to the raw score. Generated attempts preserve that distinction internally while never labeling individual field-test questions during practice.

## Future full-test controller

Full ACT mode will sequence English → Math → Reading → optional Science while keeping section timers and responses isolated. Composite estimation consumes only English, Math, and Reading estimates.
