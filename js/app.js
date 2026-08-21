import { SECTIONS, CATEGORY_LABELS } from "./config.js";
import { MATH_QUESTIONS } from "../data/math.js";
import { ENGLISH_PASSAGES } from "../data/english.js";
import { READING_PASSAGES } from "../data/reading.js";
import { SCIENCE_SETS } from "../data/science.js";
import { drawMathSection, drawEnglishSection, drawReadingSection } from "./core/draw.js";
import { drawScienceSection } from "./core/science-draw.js";
import { buildFullTestQueue, summarizeFullTest } from "./core/full-test.js";
import { mulberry32 } from "./core/random.js";
import { scoreResponses } from "./core/scoring.js";

const $ = s => document.querySelector(s);
const state = {
  mode: "section",
  sectionId: null,
  questions: [],
  responses: {},
  index: 0,
  startedAt: null,
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
  for(const id of ['home','practice','between','results','full-results']) $(`#${id}`).hidden=true;
}

function renderHome() {
  clearInterval(state.timer);
  hideAllViews();
  $('#home').hidden=false;
  state.mode='section'; state.sectionId=null; state.fullQueue=[]; state.fullIndex=0; state.fullResults={};
  const cards=$('#section-cards'); cards.innerHTML='';
  for (const section of Object.values(SECTIONS)) {
    const card=document.createElement('article'); card.className='card';
    const available=section.status==='draft';
    card.innerHTML=`<div class="eyebrow">${section.optional?'Optional section':'Core section'}</div><h2>${section.label}</h2><p>${section.totalItems} questions · ${section.minutes} minutes</p><p>${section.scoredItems} scored + ${section.fieldTestItems} embedded field-test items</p><button ${available?'':'disabled'}>${available?'Start draft practice':'Content in development'}</button>`;
    if (available) card.querySelector('button').addEventListener('click',()=>startSection(section.id));
    cards.appendChild(card);
  }
}

function drawForSection(sectionId,rng){
  const section=SECTIONS[sectionId];
  if(sectionId==='math') return drawMathSection(MATH_QUESTIONS,section,rng);
  if(sectionId==='english') return drawEnglishSection(ENGLISH_PASSAGES,section,rng);
  if(sectionId==='reading') return drawReadingSection(READING_PASSAGES,section,rng);
  if(sectionId==='science') return drawScienceSection(SCIENCE_SETS,section,rng);
  throw new Error(`Section ${sectionId} is not implemented`);
}

function beginSection(sectionId) {
  const section=SECTIONS[sectionId];
  const seed=(Date.now() ^ Math.floor(Math.random()*0xffffffff))>>>0;
  state.questions=drawForSection(sectionId,mulberry32(seed));
  state.sectionId=sectionId;
  state.responses={}; state.index=0; state.startedAt=Date.now(); state.secondsLeft=section.minutes*60;
  hideAllViews(); $('#practice').hidden=false;
  clearInterval(state.timer);
  state.timer=setInterval(()=>{
    state.secondsLeft=Math.max(0,state.secondsLeft-1);
    $('#timer').textContent=formatTime(state.secondsLeft);
    if(!state.secondsLeft) finishSection();
  },1000);
  renderQuestion();
}

function startSection(sectionId) {
  state.mode='section'; state.fullQueue=[]; state.fullResults={}; state.fullIndex=0;
  beginSection(sectionId);
}

function startFullTest(includeScience){
  state.mode='full';
  state.fullQueue=buildFullTestQueue(includeScience);
  state.fullIndex=0;
  state.fullResults={};
  beginSection(state.fullQueue[0]);
}

function renderQuestion() {
  const q=state.questions[state.index];
  $('#timer').textContent=formatTime(state.secondsLeft);
  const fullPrefix=state.mode==='full' ? `Full ACT · ${state.fullIndex+1}/${state.fullQueue.length} sections · ` : '';
  $('#progress').textContent=`${fullPrefix}${SECTIONS[state.sectionId].label} · Question ${state.index+1} of ${state.questions.length}`;
  const passage=$('#passage-panel');
  if(q.passageText){
    passage.hidden=false;
    $('#passage-title').textContent=q.passageTitle;
    const format=q.passageFormat && q.passageFormat!=='single' ? ` · ${q.passageFormat.toUpperCase()} format` : '';
    const descriptor=state.sectionId==='science' ? `${q.passageGenre} science set` : `${q.passageGenre} passage`;
    $('#passage-meta').textContent=`${descriptor}${format} · question ${q.passageQuestionNumber} of ${q.passageQuestionCount} in this set`;
    $('#passage-text').textContent=q.passageText;
  } else {
    passage.hidden=true;
  }
  $('#stem').textContent=q.stem;
  const list=$('#choices'); list.innerHTML='';
  q.choices.forEach((text,i)=>{
    const letter='ABCD'[i]; const label=document.createElement('label'); label.className='choice';
    label.innerHTML=`<input type="radio" name="choice" value="${letter}" ${state.responses[q.id]===letter?'checked':''}><span><strong>${letter}.</strong> ${text}</span>`;
    label.querySelector('input').addEventListener('change',e=>{state.responses[q.id]=e.target.value;});
    list.appendChild(label);
  });
  $('#prev').disabled=state.index===0; $('#next').textContent=state.index===state.questions.length-1?'Finish section':'Next';
}

function renderSectionResult(result){
  hideAllViews(); $('#results').hidden=false;
  const sectionId=state.sectionId;
  $('#result-section').textContent=SECTIONS[sectionId].label;
  $('#score-estimate').textContent=`${result.estimate}`;
  $('#score-range').textContent=result.low===result.high?`${result.low}`:`${result.low}–${result.high}`;
  $('#raw-score').textContent=`${result.raw} / ${result.maxRaw}`;
  const rows=$('#category-results'); rows.innerHTML='';
  Object.entries(result.categories).forEach(([cat,v])=>{
    const div=document.createElement('div'); div.className='result-row';
    div.innerHTML=`<span>${CATEGORY_LABELS[sectionId]?.[cat]||cat}</span><strong>${v.correct}/${v.total}</strong>`;
    rows.appendChild(div);
  });
}

function renderBetweenSections(){
  hideAllViews(); $('#between').hidden=false;
  $('#completed-section').textContent=SECTIONS[state.sectionId].label;
  $('#next-section').textContent=SECTIONS[state.fullQueue[state.fullIndex+1]].label;
}

function renderFullResults(){
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
    const suffix=sectionId==='science'?' · not included in Composite':'';
    div.innerHTML=`<span>${SECTIONS[sectionId].label}${suffix}<br><small>Raw ${result.raw}/${result.maxRaw} · estimate range ${range}</small></span><strong>${result.estimate}</strong>`;
    rows.appendChild(div);
  }
}

function finishSection() {
  clearInterval(state.timer);
  const result=scoreResponses(state.questions,state.responses,state.sectionId);
  if(state.mode==='full'){
    state.fullResults[state.sectionId]=result;
    if(state.fullIndex<state.fullQueue.length-1) renderBetweenSections();
    else renderFullResults();
  } else {
    renderSectionResult(result);
  }
}

$('#prev').addEventListener('click',()=>{ if(state.index>0){state.index--;renderQuestion();} });
$('#next').addEventListener('click',()=>{ if(state.index===state.questions.length-1) finishSection(); else {state.index++;renderQuestion();} });
$('#exit').addEventListener('click',()=>{
  const message=state.mode==='full'?'End this full ACT attempt? Progress will be lost.':'End this practice attempt?';
  if(confirm(message)) renderHome();
});
$('#start-full-core').addEventListener('click',()=>startFullTest(false));
$('#start-full-science').addEventListener('click',()=>startFullTest(true));
$('#continue-full').addEventListener('click',()=>{ state.fullIndex++; beginSection(state.fullQueue[state.fullIndex]); });
$('#exit-full-between').addEventListener('click',()=>{ if(confirm('End this full ACT attempt? Progress will be lost.')) renderHome(); });
$('#home-again').addEventListener('click',renderHome);
$('#full-home-again').addEventListener('click',renderHome);
renderHome();
