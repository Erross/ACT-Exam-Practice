import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { EXAM, SECTIONS } from '../js/config.js';
import { ENGLISH_PASSAGES } from '../data/english.js';
import { MATH_QUESTIONS } from '../data/math.js';
import { READING_PASSAGES } from '../data/reading.js';
import { SCIENCE_SETS } from '../data/science.js';

const REPOSITORY = 'Erross/ACT-Exam-Practice';
const EXPORTER_VERSION = 'act-unified-0.1';
const SECTION_ORDER = ['english', 'math', 'reading', 'science'];

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value).sort().map(key => [key, stableValue(value[key])])
    );
  }
  return value;
}

export function stableStringify(value) {
  return JSON.stringify(stableValue(value));
}

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function git(...args) {
  return execFileSync('git', args, { encoding: 'utf8' }).trim();
}

function currentCommit() {
  const sha = git('rev-parse', 'HEAD');
  if (!/^[0-9a-f]{40}$/.test(sha)) throw new Error(`Expected full HEAD SHA, got ${sha}`);
  return sha;
}

function sourceManifest() {
  const output = git('ls-tree', '-r', 'HEAD', '--', 'js/config.js', 'data', 'tools/export-unified.js');
  if (!output) return [];
  return output.split('\n').map(line => {
    const match = line.match(/^\d+\s+blob\s+([0-9a-f]{40})\t(.+)$/);
    if (!match) throw new Error(`Cannot parse git ls-tree line: ${line}`);
    const [, blobSha, filePath] = match;
    return {
      path: filePath,
      blobSha,
      role: filePath === 'js/config.js' ? 'registry' : filePath === 'tools/export-unified.js' ? 'exporter' : 'effective-content-source'
    };
  }).sort((a, b) => a.path.localeCompare(b.path));
}

function without(object, omitted) {
  return Object.fromEntries(Object.entries(object).filter(([key]) => !omitted.has(key)));
}

function answerFromLetter(choices, correct, itemId) {
  if (!Array.isArray(choices) || choices.length < 2) throw new Error(`${itemId}: choices missing`);
  if (typeof correct !== 'string' || !/^[A-Z]$/.test(correct)) throw new Error(`${itemId}: unsupported correct key ${correct}`);
  const index = correct.charCodeAt(0) - 65;
  if (index < 0 || index >= choices.length) throw new Error(`${itemId}: correct key ${correct} outside displayed choices`);
  return choices[index];
}

function normalizeQuestion(question, sectionId, stimulusId = null) {
  if (!question?.id || !question?.stem) throw new Error(`${sectionId}: encountered question without id/stem`);
  const omitted = new Set(['id', 'section', 'stem', 'choices', 'correct', 'rationale']);
  const metadata = without(question, omitted);
  return {
    id: question.id,
    assessmentId: EXAM.id,
    sectionIds: [sectionId],
    itemType: 'multiple_choice',
    points: 1,
    prompt: question.stem,
    ...(stimulusId ? { stimulusRefs: [stimulusId] } : {}),
    response: {
      kind: 'single-choice',
      options: [...question.choices]
    },
    scoring: {
      mode: 'automatic',
      answer: answerFromLetter(question.choices, question.correct, question.id),
      rationale: question.rationale ?? null
    },
    metadata,
    extensions: { sourceCorrectKey: question.correct }
  };
}

function normalizeGroup(group, sectionId) {
  if (!group?.id || !Array.isArray(group.questions)) throw new Error(`${sectionId}: invalid grouped stimulus`);
  const displayText = group.displayText ?? group.text ?? null;
  const omitted = new Set(['id', 'title', 'text', 'displayText', 'questions']);
  const metadata = without(group, omitted);
  return {
    stimulus: {
      id: group.id,
      title: group.title ?? null,
      text: displayText,
      provenance: 'original-project-content',
      metadata
    },
    items: group.questions.map(question => normalizeQuestion(question, sectionId, group.id))
  };
}

function normalizeSection(sectionId, order) {
  const source = SECTIONS[sectionId];
  if (!source) throw new Error(`Missing ACT section config ${sectionId}`);
  const reserved = new Set(['id', 'label', 'totalItems', 'scoredItems', 'fieldTestItems', 'minutes', 'status', 'optional', 'calculatorAllowed']);
  const blueprint = without(source, reserved);
  return {
    id: source.id,
    label: source.label,
    order,
    status: source.status,
    optional: Boolean(source.optional),
    timing: { mode: 'countdown', minutes: source.minutes },
    calculator: { policy: source.calculatorAllowed ? 'available' : 'none' },
    totalItems: source.totalItems,
    scoredItems: source.scoredItems,
    fieldTestItems: source.fieldTestItems,
    blueprint,
    supportedItemTypes: ['multiple_choice'],
    deferredCapabilities: [],
    extensions: {}
  };
}

function effectiveContent() {
  const stimuli = [];
  const items = [];

  for (const passage of ENGLISH_PASSAGES) {
    const normalized = normalizeGroup(passage, 'english');
    stimuli.push(normalized.stimulus);
    items.push(...normalized.items);
  }

  for (const question of MATH_QUESTIONS) items.push(normalizeQuestion(question, 'math'));

  for (const passage of READING_PASSAGES) {
    const normalized = normalizeGroup(passage, 'reading');
    stimuli.push(normalized.stimulus);
    items.push(...normalized.items);
  }

  for (const set of SCIENCE_SETS) {
    const normalized = normalizeGroup(set, 'science');
    stimuli.push(normalized.stimulus);
    items.push(...normalized.items);
  }

  return { stimuli, items, rubrics: [] };
}

export function buildUnifiedActPackage({ generatedAt = new Date().toISOString(), sourceCommit = currentCommit(), manifest = sourceManifest() } = {}) {
  if (!/^[0-9a-f]{40}$/.test(sourceCommit)) throw new Error('sourceCommit must be a full git SHA');
  const sections = SECTION_ORDER.map((id, index) => normalizeSection(id, index + 1));
  const content = effectiveContent();
  const assessments = [{
    id: EXAM.id,
    family: 'act',
    name: EXAM.name,
    status: 'released',
    unofficial: true,
    fullSimulationAvailable: true,
    officialSourcesVerified: EXAM.officialSourcesVerified,
    scoringPolicy: {
      kind: 'estimated-act-scale',
      compositeSections: [...EXAM.compositeSections],
      optionalSections: [...EXAM.optionalSections],
      stemSections: [...EXAM.stemSections]
    },
    sections,
    extensions: {
      version: EXAM.version,
      writingSupported: EXAM.writingSupported
    }
  }];
  const effectiveContentFingerprint = sha256(stableStringify({ assessments, content }));

  return {
    schemaVersion: '0.1',
    package: {
      family: 'act',
      sourceRepository: REPOSITORY,
      sourceCommit,
      generatedAt,
      exporterVersion: EXPORTER_VERSION,
      effectiveContentFingerprint,
      officialSourcesVerified: EXAM.officialSourcesVerified,
      sourceManifest: manifest
    },
    assessments,
    content
  };
}

function parseArgs(argv) {
  const result = { out: null, generatedAt: null };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--out') result.out = argv[++i];
    else if (arg === '--generated-at') result.generatedAt = argv[++i];
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return result;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const artifact = buildUnifiedActPackage(args.generatedAt ? { generatedAt: args.generatedAt } : undefined);
  const json = `${JSON.stringify(artifact, null, 2)}\n`;
  if (args.out) {
    const outPath = path.resolve(args.out);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, json, 'utf8');
    console.log(`Wrote ${artifact.content.items.length} items to ${outPath}`);
  } else {
    process.stdout.write(json);
  }
}

const invokedPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : null;
if (invokedPath === import.meta.url) main();
