import { rm, mkdir, cp } from "node:fs/promises";
const out = new URL("../_site/", import.meta.url);
await rm(out,{recursive:true,force:true}); await mkdir(out,{recursive:true});
for (const path of ["index.html","about.html","official-sources.html","styles.css","js","data"]) {
  await cp(new URL(`../${path}`,import.meta.url),new URL(`../_site/${path}`,import.meta.url),{recursive:true});
}
console.log("Built _site/");
