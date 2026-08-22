import { SECTIONS, CATEGORY_LABELS, isSectionAvailable } from "./config.js";
import { MATH_QUESTIONS } from "../data/math.js";
import { ENGLISH_PASSAGES } from "../data/english.js";
import { READING_PASSAGES } from "../data/reading.js";
import { SCIENCE_SETS } from "../data/science.js";
import { drawMathSection, drawEnglishSection, drawReadingSection } from "./core/draw.js";
import { drawScienceSection } from "./core/science-draw.js";
import { buildFullTestQueue, fullTestCommitment, fullTestTransition, summarizeFullTest } from "./core/full-test.js";
import { mulberry32 } from "./core/random.js";
import { scoreResponses } from "./core/scoring.js";
import { attemptStatus, buildAnswerReview, answerText } from "./core/attempt-review.js";
import { saveSession, loadSession, clearSession, isRestorableSession, remainingSeconds } from "./core/session.js";

const $ = s => document.querySelector(s);
const state = {
  mode: "section",
  phase: null,
  sectionId: null,
  preflightSectionId: null,
  questions: [],
  responses: {},
  flags: {},
  index: 0,
  startedAt: null,
  deadlineAt: null,
  secondsLeft: 0,
  timer: null,
  fullQueue: [],
  fullIndex: 0,
  fullResults: {},
};

function formatTime(sec) {
  const m=Math.floor(sec/60), s=sec%60;
  return `${m}:${String(s).padStart(2,'0')}`;
}

function hideAllViews(){
  for(const id of ['home','preflight','practice','between','results','full-results']) $(`#${id}`).hidden=true;
}

function resetRuntime(){
  clearInterval(state.timer);
  state.mode='section'; state.phase=null; state.sectionId=null; state.preflightSectionId=null;
  state.questions=[]; state.responses={}; state.flags={}; state.index=0;
  state.startedAt=null; state.deadlineAt=null; state.secondsLeft=0;
  state.fullQueue=[]; state.fullIndex=0; state.fullResults={};
}

function sessionSnapshot(){
  return {
    mode:state.mode,
    phase:state.phase,
    sectionId:state.sectionId,
    questions:state.questions,
    responses:state.responses,
    flags:state.flags,
    index:state.index,
    startedAt:state.startedAt,
    deadlineAt:state.deadlineAt,
    fullQueue:state.fullQueue,
    fullIndex:state.fullIndex,
    fullResults:state.fullResults,
  };
}

function persistSession(){
  if(state.phase && state.sectionId && state.questions.length) saveSession(sessionSnapshot());
}

function savedSessionLabel(saved){
  const section=SECTIONS[saved.sectionId]?.label || saved.sectionId;
  if(saved.mode==='full'){
    const next=saved.phase==='between' ? SECTIONS[saved.fullQueue[saved.fullIndex+1]]?.label : section;
    return `Full ACT · ${saved.fullIndex+1} of ${saved.fullQueue.length} sections · ${saved.phase==='between'?'ready for '+next:section+' in progress'}`;
  }
  return `${section} practice · question ${saved.index+1} of ${saved.questions.length}`;
}

function updateResumeCard(){
  const card=$('#resume-card');
  if(!card) return;
  const saved=loadSession();
  const valid=isRestorableSession(saved);
  card.hidden=!valid;
  if(valid) $('#resume-detail').textContent=savedSessionLabel(saved);
}

function renderHome() {
  resetRuntime();
  hideAllViews();
  $('#home').hidden=false;
  const cards=$('#section-cards'); cards.innerHTML='';
  for(const section of Object.values(SECTIONS)){
    const card=document.createElement('article'); card.className='card';
    const available=isSectionAvailable(section);
    const calculator=section.id==='math' ? '<p>Calculator permitted · online ACT includes Desmos</p>' : '<p>No calculator for this section</p>';
    card.innerHTML=`<div class="eyebrow">${section.optional?'Optional section':'Composite section'}</div><h2>${section.label}</h2><p>${section.totalItems} questions · ${section.minutes} minutes</p><p>${section.scoredItems} scored + ${section.fieldTestItems} embedded field-test items</p>${calculator}<button ${available?'':'disabled'}>${available?'Review details & start':'Content in development'}</button>`;
    if(available) card.querySelector('button').addEventListener('click',()=>startSection(section.id));
    cards.appendChild(card);
  }
  updateResumeCard();
}

function drawForSection(sectionId,rng){
  const section=SECTIONS[sectionId];
  if(sectionId==='math') return drawMathSection(MATH_QUESTIONS,section,rng);
  if(sectionId==='english') return drawEnglishSection(ENGLISH_PASSAGES,section,rng);
  if(sectionId==='reading') return drawReadingSection(READING_PASSAGES,section,rng);
  if(sectionId==='science') return drawScienceSection(SCIENCE_SETS,section,rng);
  throw new Error(`Section ${sectionId} is not implemented`);
}

function appendRule(text){
  const li=document.createElement('li'); li.textContent=text; $('#preflight-rules').appendChild(li);
}

function showPreflight(sectionId){
  const section=SECTIONS[sectionId];
  state.preflightSectionId=sectionId;
  hideAllViews(); $('#preflight').hidden=false;
  $('#preflight-mode').textContent=state.mode==='full'
    ? `Full ACT practice · Section ${state.fullIndex+1} of ${state.fullQueue.length}`
    : 'Individual section practice';
  $('#preflight-title').textContent=`${section.label} preflight`;
  $('#preflight-summary').textContent=`${section.totalItems} questions · ${section.minutes} minutes · ${section.scoredItems} scored + ${section.fieldTestItems} embedded non-scored field-test items.`;
  const rules=$('#preflight-rules'); rules.innerHTML='';
  if(state.mode==='full' && state.fullIndex===0){
    const includeScience=state.fullQueue.includes('science');
    const commitment=fullTestCommitment(SECTIONS,includeScience);
    appendRule(`This full attempt contains ${commitment.questions} displayed questions across ${commitment.minutes} timed minutes${includeScience?', including optional Science':''}. ACT Writing is not included.`);
    appendRule('For realistic standard-time practice, the scheduled break is after Mathematics. This app leaves the break student-controlled and does not run a break timer.');
  }
  appendRule('The section timer does not start on this screen. It begins when you press “Begin section and start timer.”');
  appendRule(sectionId==='math'
    ? 'A permitted calculator may be used on Mathematics; the online ACT includes Desmos. The practice questions use the current four-choice Math format.'
    : 'A calculator is not permitted for this section.');
  appendRule('Use the question navigator to move within the current section. Flag questions for review and return to them before submitting.');
  appendRule('Submitting ends the section. If questions are unanswered or flagged, the app warns you before submission.');
  appendRule('Embedded field-test items are mixed into the section and do not count toward the scored raw result. They are identified only after submission.');
  appendRule('Any 1–36 section score, Composite, or STEM score shown here is an unofficial estimate based on published official practice-form conversions.');
  if(state.mode==='full') appendRule('Full-test section scores stay hidden until the entire attempt ends. After leaving a completed section, you cannot return to it.');
  $('#preflight-title').focus();
}

function startTimer(){
  clearInterval(state.timer);
  const tick=()=>{
    state.secondsLeft=Math.max(0,Math.ceil((state.deadlineAt-Date.now())/1000));
    $('#timer').textContent=formatTime(state.secondsLeft);
    if(!state.secondsLeft){ clearInterval(state.timer); finishSection(true); }
  };
  tick();
  if(state.secondsLeft) state.timer=setInterval(tick,1000);
}

function beginSection(sectionId){
  const section=SECTIONS[sectionId];
  const seed=(Date.now() ^ Math.floor(Math.random()*0xffffffff))>>>0;
  state.questions=drawForSection(sectionId,mulberry32(seed));
  state.sectionId=sectionId;
  state.preflightSectionId=null;
  state.phase='practice';
  state.responses={}; state.flags={}; state.index=0; state.startedAt=Date.now();
  state.deadlineAt=state.startedAt+section.minutes*60*1000;
  state.secondsLeft=section.minutes*60;
  hideAllViews(); $('#practice').hidden=false;
  persistSession();
  startTimer();
  renderQuestion(true);
}

function startSection(sectionId){
  clearSession();
  state.mode='section'; state.fullQueue=[]; state.fullResults={}; state.fullIndex=0;
  showPreflight(sectionId);
}

function startFullTest(includeScience){
  clearSession();
  state.mode='full';
  state.fullQueue=buildFullTestQueue(includeScience);
  state.fullIndex=0;
  state.fullResults={};
  showPreflight(state.fullQueue[0]);
}

function restoreSavedAttempt(){
  const saved=loadSession();
  if(!isRestorableSession(saved)){ clearSession(); renderHome(); return; }
  resetRuntime();
  state.mode=saved.mode; state.phase=saved.phase; state.sectionId=saved.sectionId;
  state.questions=saved.questions; state.responses=saved.responses; state.flags=saved.flags; state.index=saved.index;
  state.startedAt=saved.startedAt || null; state.deadlineAt=saved.deadlineAt || null;
  state.fullQueue=saved.fullQueue || []; state.fullIndex=saved.fullIndex || 0; state.fullResults=saved.fullResults || {};
  if(state.phase==='between'){ renderBetweenSections(); return; }
  state.secondsLeft=remainingSeconds(saved);
  hideAllViews(); $('#practice').hidden=false;
  if(!state.secondsLeft){ finishSection(true); return; }
  startTimer();
  renderQuestion(true);
}

function buildTable(spec){
  const wrap=document.createElement('div'); wrap.className='table-wrap';
  const table=document.createElement('table');
  if(spec.caption){ const caption=document.createElement('caption'); caption.textContent=spec.caption; table.appendChild(caption); }
  const thead=document.createElement('thead'); const header=document.createElement('tr');
  for(const name of spec.columns){ const th=document.createElement('th'); th.scope='col'; th.textContent=name; header.appendChild(th); }
  thead.appendChild(header); table.appendChild(thead);
  const tbody=document.createElement('tbody');
  for(const row of spec.rows){
    const tr=document.createElement('tr');
    row.forEach((value,index)=>{
      const cell=document.createElement(index===0?'th':'td');
      if(index===0) cell.scope='row';
      cell.textContent=value;
      tr.appendChild(cell);
    });
    tbody.appendChild(tr);
  }
  table.appendChild(tbody); wrap.appendChild(table); return wrap;
}

function renderSupplement(supplement){
  const host=$('#passage-supplement'); host.innerHTML='';
  if(!supplement){ host.hidden=true; return; }
  const tables=supplement.type==='tables' ? supplement.tables : [supplement];
  for(const spec of tables){
    if(spec.type && spec.type!=='table') throw new Error(`Unsupported passage supplement ${spec.type}`);
    host.appendChild(buildTable(spec));
  }
  host.hidden=false;
}

function passageDescriptor(q){
  if(state.sectionId==='science') return `${q.passageGenre} science set`;
  if(state.sectionId==='english'){
    const domains={HUM:'humanities',SSC:'social science',NSC:'natural science'};
    return `${q.passageWritingType} · ${domains[q.passageDomain]||q.passageDomain} passage`;
  }
  return `${q.passageGenre} passage`;
}

function currentAttemptStatus(){ return attemptStatus(state.questions,state.responses,state.flags); }

function renderNavigator(){
  const host=$('#navigator-grid'); host.innerHTML='';
  state.questions.forEach((q,index)=>{
    const btn=document.createElement('button'); btn.type='button'; btn.className='nav-item'; btn.textContent=String(index+1);
    const answered=state.responses[q.id]!==undefined;
    const flagged=Boolean(state.flags[q.id]);
    const current=index===state.index;
    btn.classList.toggle('answered',answered);
    btn.classList.toggle('flagged',flagged);
    btn.classList.toggle('current',current);
    if(current) btn.setAttribute('aria-current','true');
    const labels=[answered?'answered':'not answered'];
    if(flagged) labels.push('flagged for review');
    if(current) labels.push('current question');
    btn.setAttribute('aria-label',`Question ${index+1}, ${labels.join(', ')}`);
    btn.addEventListener('click',()=>goToQuestion(index,true));
    host.appendChild(btn);
  });
  const status=currentAttemptStatus();
  $('#attempt-status').textContent=`${status.answered}/${status.total} answered · ${status.flagged} flagged`;
}

function renderQuestion(focus=false){
  const q=state.questions[state.index];
  $('#timer').textContent=formatTime(state.secondsLeft);
  const fullPrefix=state.mode==='full' ? `Full ACT · ${state.fullIndex+1}/${state.fullQueue.length} sections · ` : '';
  $('#progress').textContent=`${fullPrefix}${SECTIONS[state.sectionId].label} · Question ${state.index+1} of ${state.questions.length}`;
  const passage=$('#passage-panel');
  if(q.passageText){
    passage.hidden=false;
    $('#passage-title').textContent=q.passageTitle;
    const format=q.passageFormat && q.passageFormat!=='single' ? ` · ${q.passageFormat.toUpperCase()} format` : '';
    const engineering=state.sectionId==='science' && q.passageEngineeringDesign ? ' · engineering/design context' : '';
    $('#passage-meta').textContent=`${passageDescriptor(q)}${engineering}${format} · question ${q.passageQuestionNumber} of ${q.passageQuestionCount} in this set`;
    $('#passage-text').textContent=q.passageText;
    renderSupplement(q.passageSupplement);
  } else {
    passage.hidden=true;
    renderSupplement(null);
  }
  $('#stem').textContent=q.stem;
  const list=$('#choices'); list.innerHTML='';
  q.choices.forEach((text,i)=>{
    const letter='ABCD'[i]; const label=document.createElement('label'); label.className='choice';
    const input=document.createElement('input'); input.type='radio'; input.name='choice'; input.value=letter; input.checked=state.responses[q.id]===letter;
    const span=document.createElement('span'); const strong=document.createElement('strong'); strong.textContent=`${letter}. `; span.appendChild(strong); span.appendChild(document.createTextNode(text));
    label.appendChild(input); label.appendChild(span);
    input.addEventListener('change',e=>{ state.responses[q.id]=e.target.value; persistSession(); renderNavigator(); });
    list.appendChild(label);
  });
  const flagged=Boolean(state.flags[q.id]);
  $('#flag-question').setAttribute('aria-pressed',flagged?'true':'false');
  $('#flag-question').textContent=flagged?'Unflag question':'Flag for review';
  $('#prev').disabled=state.index===0;
  $('#next').textContent=state.index===state.questions.length-1?'Review & submit':'Next';
  renderNavigator();
  if(focus) $('#stem').focus();
}

function goToQuestion(index,focus=false){
  if(index<0 || index>=state.questions.length) return;
  state.index=index; persistSession(); renderQuestion(focus);
}

function renderReviewItems(host,review){
  host.innerHTML='';
  for(const item of review){
    const article=document.createElement('article'); article.className='review-item';
    const heading=document.createElement('h3');
    const isCorrect=item.response===item.correct;
    const resultLabel=item.response===null?'Unanswered':isCorrect?'Correct':'Incorrect';
    heading.textContent=`Question ${item.number} · ${resultLabel}${item.scored?'':' · embedded field-test (not scored)'}`;
    const stem=document.createElement('p'); stem.className='review-stem'; stem.textContent=item.stem;
    const yours=document.createElement('p'); yours.textContent=`Your answer: ${answerText(item,item.response)}`;
    const correct=document.createElement('p'); correct.textContent=`Correct answer: ${answerText(item,item.correct)}`;
    const rationale=document.createElement('p'); rationale.className='review-rationale'; rationale.textContent=`Why: ${item.rationale}`;
    article.append(heading,stem,yours,correct,rationale); host.appendChild(article);
  }
}

function renderSectionResult(result){
  clearSession();
  state.phase=null;
  hideAllViews(); $('#results').hidden=false;
  const sectionId=state.sectionId;
  $('#result-section').textContent=SECTIONS[sectionId].label;
  $('#score-estimate').textContent=`${result.estimate}`;
  $('#score-range').textContent=result.low===result.high?`${result.low}`:`${result.low}–${result.high}`;
  $('#raw-score').textContent=`${result.raw} / ${result.maxRaw}`;
  const rows=$('#category-results'); rows.innerHTML='';
  Object.entries(result.categories).forEach(([cat,v])=>{
    const div=document.createElement('div'); div.className='result-row';
    const label=document.createElement('span'); label.textContent=CATEGORY_LABELS[sectionId]?.[cat]||cat;
    const score=document.createElement('strong'); score.textContent=`${v.correct}/${v.total}`;
    div.append(label,score); rows.appendChild(div);
  });
  renderReviewItems($('#answer-review'),result.review);
}

function renderBetweenSections(){
  state.phase='between'; state.deadlineAt=null;
  persistSession();
  hideAllViews(); $('#between').hidden=false;
  $('#completed-section').textContent=SECTIONS[state.sectionId].label;
  const nextId=state.fullQueue[state.fullIndex+1];
  const next=SECTIONS[nextId];
  const transition=fullTestTransition(state.sectionId,nextId);
  $('#next-section').textContent=next.label;
  $('#next-section-detail').textContent=`${transition.heading}. ${transition.guidance} ${next.totalItems} questions · ${next.minutes} minutes · ${nextId==='math'?'calculator permitted':'no calculator'}.`;
  $('#continue-full').textContent=nextId==='science'?'Begin optional Science':`Begin ${next.label}`;
}

function renderFullResults(){
  clearSession();
  state.phase=null;
  const summary=summarizeFullTest(state.fullResults);
  hideAllViews(); $('#full-results').hidden=false;
  $('#full-composite').textContent=summary.composite ?? '—';
  $('#full-composite-range').textContent=summary.compositeLow===summary.compositeHigh
    ? `${summary.compositeLow}`
    : `${summary.compositeLow}–${summary.compositeHigh}`;
  const rows=$('#full-section-results'); rows.innerHTML='';
  for(const sectionId of state.fullQueue){
    const result=state.fullResults[sectionId];
    const div=document.createElement('div'); div.className='result-row';
    const range=result.low===result.high?`${result.low}`:`${result.low}–${result.high}`;
    const label=document.createElement('span');
    label.textContent=`${SECTIONS[sectionId].label}${sectionId==='science'?' · not included in Composite':''} — Raw ${result.raw}/${result.maxRaw} · estimate range ${range}`;
    const score=document.createElement('strong'); score.textContent=String(result.estimate);
    div.append(label,score); rows.appendChild(div);
  }
  if(summary.stem!==null){
    const div=document.createElement('div'); div.className='result-row';
    const range=summary.stemLow===summary.stemHigh?`${summary.stemLow}`:`${summary.stemLow}–${summary.stemHigh}`;
    const label=document.createElement('span'); label.textContent=`Estimated STEM — average of Mathematics and Science · observed practice-form range ${range}`;
    const score=document.createElement('strong'); score.textContent=String(summary.stem);
    div.append(label,score); rows.appendChild(div);
  }
  const reviewHost=$('#full-answer-review'); reviewHost.innerHTML='';
  for(const sectionId of state.fullQueue){
    const details=document.createElement('details'); details.className='review-section';
    const summaryNode=document.createElement('summary'); summaryNode.textContent=`${SECTIONS[sectionId].label} answer review`;
    const body=document.createElement('div'); renderReviewItems(body,state.fullResults[sectionId].review);
    details.append(summaryNode,body); reviewHost.appendChild(details);
  }
}

function finishSection(timedOut=false){
  clearInterval(state.timer);
  const result={
    ...scoreResponses(state.questions,state.responses,state.sectionId),
    review:buildAnswerReview(state.questions,state.responses),
    timedOut,
  };
  if(state.mode==='full'){
    state.fullResults[state.sectionId]=result;
    if(state.fullIndex<state.fullQueue.length-1) renderBetweenSections();
    else renderFullResults();
  } else {
    renderSectionResult(result);
  }
}

function requestFinishSection(){
  const status=currentAttemptStatus();
  const notes=[];
  if(status.unanswered) notes.push(`${status.unanswered} unanswered`);
  if(status.flagged) notes.push(`${status.flagged} flagged for review`);
  const message=notes.length
    ? `You still have ${notes.join(' and ')}. Submit this section anyway?`
    : 'Submit this section now? You will not be able to change answers afterward.';
  if(confirm(message)) finishSection(false);
}

$('#prev').addEventListener('click',()=>{ if(state.index>0) goToQuestion(state.index-1,true); });
$('#next').addEventListener('click',()=>{ if(state.index===state.questions.length-1) requestFinishSection(); else goToQuestion(state.index+1,true); });
$('#flag-question').addEventListener('click',()=>{
  const id=state.questions[state.index].id;
  if(state.flags[id]) delete state.flags[id]; else state.flags[id]=true;
  persistSession(); renderQuestion(false);
});
$('#submit-section').addEventListener('click',requestFinishSection);
$('#exit').addEventListener('click',()=>{
  const message=state.mode==='full'?'End this full ACT attempt? Progress will be lost.':'End this practice attempt?';
  if(confirm(message)){ clearSession(); renderHome(); }
});
$('#start-full-core').addEventListener('click',()=>startFullTest(false));
$('#start-full-science').addEventListener('click',()=>startFullTest(true));
$('#begin-preflight').addEventListener('click',()=>beginSection(state.preflightSectionId));
$('#cancel-preflight').addEventListener('click',renderHome);
$('#continue-full').addEventListener('click',()=>{ state.fullIndex++; beginSection(state.fullQueue[state.fullIndex]); });
$('#exit-full-between').addEventListener('click',()=>{ if(confirm('End this full ACT attempt? Progress will be lost.')){ clearSession(); renderHome(); } });
$('#resume-attempt')?.addEventListener('click',restoreSavedAttempt);
$('#discard-attempt')?.addEventListener('click',()=>{ clearSession(); renderHome(); });
$('#home-again').addEventListener('click',renderHome);
$('#full-home-again').addEventListener('click',renderHome);
renderHome();