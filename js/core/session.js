const KEY = "act-practice-session-v2";
export const SESSION_VERSION = 2;

function defaultStorage(){
  return typeof localStorage === "undefined" ? null : localStorage;
}

export function saveSession(session, storage=defaultStorage()) {
  if(!storage) return;
  storage.setItem(KEY, JSON.stringify({ ...session, version: SESSION_VERSION }));
}

export function loadSession(storage=defaultStorage()) {
  if(!storage) return null;
  try { return JSON.parse(storage.getItem(KEY) || "null"); } catch { return null; }
}

export function clearSession(storage=defaultStorage()) {
  if(storage) storage.removeItem(KEY);
}

export function remainingSeconds(session, now=Date.now()){
  if(!Number.isFinite(session?.deadlineAt)) return 0;
  return Math.max(0,Math.ceil((session.deadlineAt-now)/1000));
}

export function isRestorableSession(session){
  if(!session || session.version!==SESSION_VERSION) return false;
  if(!["section","full"].includes(session.mode)) return false;
  if(!["practice","between"].includes(session.phase)) return false;
  if(typeof session.sectionId!=="string") return false;
  if(!Array.isArray(session.questions) || !session.questions.length) return false;
  if(!session.responses || typeof session.responses!=="object") return false;
  if(!Number.isInteger(session.index) || session.index<0 || session.index>=session.questions.length) return false;
  if(session.phase==="practice" && !Number.isFinite(session.deadlineAt)) return false;
  if(session.mode==="full"){
    if(!Array.isArray(session.fullQueue) || session.fullQueue.length<3) return false;
    if(!Number.isInteger(session.fullIndex) || session.fullIndex<0 || session.fullIndex>=session.fullQueue.length) return false;
    if(!session.fullResults || typeof session.fullResults!=="object") return false;
  }
  return true;
}
