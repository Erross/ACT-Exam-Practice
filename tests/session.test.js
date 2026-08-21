import test from "node:test";
import assert from "node:assert/strict";
import { SESSION_VERSION, saveSession, loadSession, clearSession, isRestorableSession, remainingSeconds } from "../js/core/session.js";

function memoryStorage(){
  const values=new Map();
  return {
    setItem:(k,v)=>values.set(k,String(v)),
    getItem:k=>values.has(k)?values.get(k):null,
    removeItem:k=>values.delete(k),
  };
}

function validSession(overrides={}){
  return {
    version:SESSION_VERSION,
    mode:"section",
    phase:"practice",
    sectionId:"math",
    questions:[{id:"Q1"}],
    responses:{},
    index:0,
    deadlineAt:10_000,
    fullQueue:[],
    fullIndex:0,
    fullResults:{},
    ...overrides,
  };
}

test("saved sessions round-trip with the current version",()=>{
  const storage=memoryStorage();
  saveSession(validSession(),storage);
  const loaded=loadSession(storage);
  assert.equal(loaded.version,SESSION_VERSION);
  assert.equal(loaded.sectionId,"math");
  assert.equal(isRestorableSession(loaded),true);
  clearSession(storage);
  assert.equal(loadSession(storage),null);
});

test("remaining time uses an absolute deadline instead of resetting on reload",()=>{
  const session=validSession({deadlineAt:125_000});
  assert.equal(remainingSeconds(session,65_000),60);
  assert.equal(remainingSeconds(session,130_000),0);
});

test("invalid, old, and incomplete sessions are rejected",()=>{
  assert.equal(isRestorableSession(null),false);
  assert.equal(isRestorableSession(validSession({version:1})),false);
  assert.equal(isRestorableSession(validSession({questions:[]})),false);
  assert.equal(isRestorableSession(validSession({deadlineAt:null})),false);
  assert.equal(isRestorableSession(validSession({mode:"full",fullQueue:["english"],fullResults:{}})),false);
});

test("between-section full-test sessions do not require an active deadline",()=>{
  const session=validSession({
    mode:"full",
    phase:"between",
    sectionId:"english",
    deadlineAt:null,
    fullQueue:["english","math","reading"],
    fullIndex:0,
    fullResults:{english:{estimate:28}},
  });
  assert.equal(isRestorableSession(session),true);
});
