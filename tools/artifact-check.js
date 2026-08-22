import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";

function filesUnder(root){
  const out=[];
  for(const entry of readdirSync(root,{withFileTypes:true})){
    const full=path.join(root,entry.name);
    if(entry.isDirectory()) out.push(...filesUnder(full));
    else out.push(full.replaceAll('\\','/'));
  }
  return out.sort();
}

for(const required of [
  "_site/index.html",
  "_site/about.html",
  "_site/official-sources.html",
  "_site/styles.css",
  "_site/js/app.js",
  "_site/js/config.js",
  "_site/data/math.js",
  "_site/data/english.js",
  "_site/data/reading.js",
  "_site/data/science.js",
]) assert(existsSync(required),`production artifact missing ${required}`);

const sourceHtml=readFileSync("index.html","utf8");
const builtHtml=readFileSync("_site/index.html","utf8");
const sourcesHtml=readFileSync("_site/official-sources.html","utf8");
assert.equal(builtHtml,sourceHtml,"built index.html must match the browser entry source exactly");
assert.match(builtHtml,/src="js\/app\.js"/);
assert.match(builtHtml,/href="official-sources\.html"/);
assert.match(sourcesHtml,/Official ACT standards & sources/);
assert.match(sourcesHtml,/August 21, 2026/);
assert.match(sourcesHtml,/Design Framework for the ACT Enhancements/);
assert.doesNotMatch(sourcesHtml,/\b(?:AM|PM|CDT|CST|UTC)\b/);

for(const directory of ["js","data"]){
  const sourceFiles=filesUnder(directory).map(file=>file.slice(directory.length+1));
  const builtFiles=filesUnder(`_site/${directory}`).map(file=>file.slice(`_site/${directory}`.length+1));
  assert.deepEqual(builtFiles,sourceFiles,`${directory} production tree differs from source tree`);
  for(const relative of sourceFiles){
    assert.equal(
      readFileSync(`_site/${directory}/${relative}`,"utf8"),
      readFileSync(`${directory}/${relative}`,"utf8"),
      `${directory}/${relative} differs in production artifact`,
    );
  }
}

console.log("ACT production artifact contains the complete browser module/data trees and the public authoritative-source record.");
