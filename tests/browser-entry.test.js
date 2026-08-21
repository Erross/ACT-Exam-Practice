import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { execFileSync } from "node:child_process";

const ROOT=resolve(import.meta.dirname,"..");
const APP=resolve(ROOT,"js/app.js");
const INDEX=resolve(ROOT,"index.html");

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
  assert(imports.length>=8,"app.js unexpectedly has too few static imports");
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
  for(const id of ["home","practice","between","results","full-results"]){
    assert(html.includes(`id="${id}"`),`dynamic view id #${id} is missing`);
  }
});
