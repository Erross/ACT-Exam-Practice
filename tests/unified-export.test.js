import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import test from 'node:test';

import { buildUnifiedActPackage, stableStringify } from '../tools/export-unified.js';

const SOURCE_COMMIT = '53818f6935ef02e313b339ba06a8d51b328291f6';
const GENERATED_AT = '2026-08-23T21:55:00Z';

function build() {
  return buildUnifiedActPackage({ generatedAt: GENERATED_AT, sourceCommit: SOURCE_COMMIT, manifest: [] });
}

test('unified export contains the complete browser-effective released ACT bank', () => {
  const artifact = build();
  assert.equal(artifact.schemaVersion, '0.1');
  assert.equal(artifact.package.family, 'act');
  assert.equal(artifact.package.sourceRepository, 'Erross/ACT-Exam-Practice');
  assert.equal(artifact.package.sourceCommit, SOURCE_COMMIT);
  assert.equal(artifact.assessments.length, 1);

  const counts = Object.fromEntries(['english', 'math', 'reading', 'science'].map(section => [
    section,
    artifact.content.items.filter(item => item.sectionIds.includes(section)).length
  ]));
  assert.deepEqual(counts, { english: 150, math: 140, reading: 117, science: 137 });
  assert.equal(artifact.content.items.length, 544);

  const ids = artifact.content.items.map(item => item.id);
  assert.equal(new Set(ids).size, ids.length, 'exported item IDs must be unique');
  const stimulusIds = artifact.content.stimuli.map(stimulus => stimulus.id);
  assert.equal(new Set(stimulusIds).size, stimulusIds.length, 'exported stimulus IDs must be unique');

  for (const item of artifact.content.items) {
    assert.equal(item.response.kind, 'single-choice');
    assert(item.response.options.includes(item.scoring.answer), `${item.id}: semantic answer must exist in displayed choices`);
    assert.equal(item.scoring.mode, 'automatic');
  }
});

test('unified export preserves ACT section and field-test semantics', () => {
  const assessment = build().assessments[0];
  const sections = Object.fromEntries(assessment.sections.map(section => [section.id, section]));
  assert.deepEqual(assessment.scoringPolicy.compositeSections, ['english', 'math', 'reading']);
  assert.deepEqual(assessment.scoringPolicy.optionalSections, ['science']);
  assert.equal(sections.science.optional, true);
  assert.equal(sections.math.calculator.policy, 'available');
  assert.equal(sections.science.calculator.policy, 'none');
  for (const section of assessment.sections) {
    assert.equal(section.timing.mode, 'countdown');
    assert.equal(section.totalItems, section.scoredItems + section.fieldTestItems);
  }
});

test('effective-content fingerprint is canonical and excludes generation metadata', () => {
  const first = build();
  const second = buildUnifiedActPackage({
    generatedAt: '2030-01-01T00:00:00Z',
    sourceCommit: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    manifest: [{ path: 'different', blobSha: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', role: 'test' }]
  });
  assert.equal(first.package.effectiveContentFingerprint, second.package.effectiveContentFingerprint);

  const expected = crypto.createHash('sha256')
    .update(stableStringify({ assessments: first.assessments, content: first.content }))
    .digest('hex');
  assert.equal(first.package.effectiveContentFingerprint, expected);
  assert.match(expected, /^[0-9a-f]{64}$/);
});
