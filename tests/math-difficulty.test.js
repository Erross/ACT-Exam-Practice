import test from "node:test";
import assert from "node:assert/strict";
import { MATH_QUESTIONS } from "../data/math.js";
import { SECTIONS } from "../js/config.js";
import { drawMathSection, countBy } from "../js/core/draw.js";
import { mulberry32 } from "../js/core/random.js";

const rank=new Map(SECTIONS.math.difficultyOrder.map((name,index)=>[name,index]));

test("Math bank contains a meaningful easy-medium-hard distribution",()=>{
  const invalid=MATH_QUESTIONS.filter(q=>!rank.has(q.difficulty)).map(q=>q.id);
  assert.deepEqual(invalid,[]);
  const counts=countBy(MATH_QUESTIONS,q=>q.difficulty);
  console.log(`Math difficulty distribution: ${JSON.stringify(counts)}`);
  assert((counts.easy||0)>=20,"Math bank needs at least 20 reviewed easy items");
  assert((counts.medium||0)>=20,"Math bank needs at least 20 reviewed medium items");
  assert((counts.hard||0)>=20,"Math bank needs at least 20 reviewed hard items");
});

test("500 Math draws are displayed in nondecreasing difficulty",()=>{
  for(let seed=1;seed<=500;seed++){
    const draw=drawMathSection(MATH_QUESTIONS,SECTIONS.math,mulberry32(seed));
    for(let i=1;i<draw.length;i++){
      assert(rank.get(draw[i-1].difficulty)<=rank.get(draw[i].difficulty),`seed ${seed}: ${draw[i-1].id} (${draw[i-1].difficulty}) precedes ${draw[i].id} (${draw[i].difficulty}) incorrectly`);
    }
  }
});
