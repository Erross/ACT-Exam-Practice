import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { execFileSync } from "node:child_process";

const ROOT=resolve(import.meta.dirname,"..");
const APP=resolve(ROOT,"js/app.js");
const INDEX=resolve(ROOT,"index.html");
const ABOUT=resolve(ROOT,"about.html");
const OFFICIAL=resolve(ROOT,"official-sources.html");
const STYLES=resolve(ROOT,"styles.css");

function literalDomIds(source){
  const ids=new Set();
  const pattern=/\$\(\s*["']#([A-Za-z0-9_-]+)["']\s*\)/g;
  for(const match of source.matchAll(pattern)) ids.add(match[1]);
  return ids;
}

function relativeImports(source){
  const paths=[];
  const pattern=/from\s+["'](\.{1,2}\/[^"']+)["']/g;
  for(const match of source.matchAll(pattern)) paths.push(match[1]);
  return paths;
}

test("browser entry module parses and its literal imports resolve",()=>{
  execFileSync(process.execPath,["--check",APP],{stdio:"pipe"});
  const app=readFileSync(APP,"utf8");
  const imports=relativeImports(app);
  assert(imports.length>=9,"app.js unexpectedly has too few static imports");
  for(const specifier of imports){
    const resolved=resolve(dirname(APP),specifier);
    assert(existsSync(resolved),`browser import does not resolve: ${specifier}`);
  }
});

test("index supplies every literal DOM target required by app.js",()=>{
  const app=readFileSync(APP,"utf8");
  const html=readFileSync(INDEX,"utf8");
  assert.match(html,/script\s+type="module"\s+src="js\/app\.js"/);
  for(const id of literalDomIds(app)){
    assert(html.includes(`id="${id}"`),`app.js references missing DOM id #${id}`);
  }
  for(const id of ["home","preflight","practice","between","results","full-results"]){
    assert(html.includes(`id="${id}"`),`dynamic view id #${id} is missing`);
  }
});

test("browser shell exposes the release-critical navigation and accessibility controls",()=>{
  const html=readFileSync(INDEX,"utf8");
  assert.match(html,/class="skip-link"\s+href="#main-content"/);
  assert.match(html,/id="timer"[^>]*role="timer"/);
  assert.match(html,/id="flag-question"[^>]*aria-pressed="false"/);
  assert.match(html,/id="navigator-grid"/);
  assert.match(html,/aria-label="Question navigator"/);
  assert.match(html,/id="submit-section"[^>]*>Submit section</);
  assert.match(html,/id="begin-preflight"/);
  assert.match(html,/id="result-status"/);
  assert.match(html,/id="answer-review"/);
  assert.match(html,/id="full-answer-review"/);
});

test("release-facing pages no longer describe the V1 bank as a draft or development build",()=>{
  const index=readFileSync(INDEX,"utf8");
  const about=readFileSync(ABOUT,"utf8");
  assert.doesNotMatch(index,/Release candidate|development build|draft practice/i);
  assert.doesNotMatch(about,/development build|Timed draft practice|development drafts/i);
  assert.match(index,/Unofficial practice:/);
  assert.match(about,/What is available/);
});

test("naive-user safeguards are present in the browser-effective entry layer",()=>{
  const app=readFileSync(APP,"utf8");
  const about=readFileSync(ABOUT,"utf8");
  const official=readFileSync(OFFICIAL,"utf8");
  const styles=readFileSync(STYLES,"utf8");
  assert.match(app,/function confirmReplaceSavedAttempt/);
  assert.match(app,/Starting a new attempt will permanently discard it/);
  assert.match(app,/There is no penalty for an incorrect answer/);
  assert.match(app,/this practice site does not embed a calculator/i);
  assert.match(app,/Time expired\. This section was submitted automatically/);
  assert.match(about,/does not embed a calculator/);
  assert.match(official,/class="skip-link"\s+href="#main-content"/);
  assert.match(official,/id="main-content"/);
  assert.match(styles,/\.exam-main\.with-passage/);
});
