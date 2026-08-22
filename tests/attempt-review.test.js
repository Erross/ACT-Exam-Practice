import test from "node:test";
import assert from "node:assert/strict";
import { attemptStatus, buildAnswerReview, answerText } from "../js/core/attempt-review.js";

const QUESTIONS=[
  {id:"Q1",stem:"First?",choices:["one","two","three","four"],correct:"B",rationale:"Two is correct.",scored:true},
  {id:"Q2",stem:"Second?",choices:["red","blue","green","gold"],correct:"C",rationale:"Green is correct.",scored:false},
  {id:"Q3",stem:"Third?",choices:["a","b","c","d"],correct:"A",rationale:"A is correct.",scored:true},
];

test("attempt status counts answered, unanswered, and flagged independently",()=>{
  assert.deepEqual(
    attemptStatus(QUESTIONS,{Q1:"B",Q3:"D"},{Q1:true,Q2:true}),
    {total:3,answered:2,unanswered:1,flagged:2},
  );
});

test("answer review preserves displayed choice order and scored status",()=>{
  const review=buildAnswerReview(QUESTIONS,{Q1:"B",Q3:"D"});
  assert.equal(review.length,3);
  assert.equal(review[0].response,"B");
  assert.equal(review[1].response,null);
  assert.equal(review[1].scored,false);
  assert.equal(review[2].correct,"A");
  assert.equal(answerText(review[0],review[0].response),"B. two");
  assert.equal(answerText(review[1],review[1].response),"No answer");
  assert.equal(answerText(review[2],review[2].correct),"A. a");
});
