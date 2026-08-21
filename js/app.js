import { SECTIONS, CATEGORY_LABELS } from "./config.js";
import { MATH_QUESTIONS } from "../data/math.js";
import { ENGLISH_PASSAGES } from "../data/english.js";
import { READING_PASSAGES } from "../data/reading.js";
import { drawMathSection, drawEnglishSection, drawReadingSection } from "./core/draw.js";
import { mulberry32 } from "./core/random.js";
import { scoreResponses } from "./core/scoring.js";

const $ = s => document.querySelector(s);
const state = { sectionId: null, questions: [], responses: {}, index: 0, startedAt: null, secondsLeft: 0, timer: null };

function formatTime(sec) {
  const m=Math.floor(sec/60), s=sec%60;
  return `${m}:${String(s).padStart(2,'0')}`;
}

function renderHome() {
  $('#home').hidden=false; $('#practice').hidden=true; $('#results').hidden=true;
  const cards=$('#section-cards'); cards.innerHTML='';
  for (const section of Object.values(SECTIONS)) {
    const card=document.createElement('article'); card.className='card';
    const available=section.status==='draft';
    card.innerHTML=`<div class="eyebrow">${section.optional?'Optional section':'Core section'}</div><h2>${section.label}</h2><p>${section.totalItems} questions · ${section.minutes} minutes</p><p>${section.scoredItems} scored + ${section.fieldTestItems} embedded field-test items</p><button ${available?'':'disabled'}>${available?'Start draft practice':'Content in development'}</button>`;
    if (available) card.querySelector('button').addEventListener('click',()=>startSection(section.id));
    cards.appendChild(card);
  }
}

function startSection(sectionId) {
  const section=SECTIONS[sectionId];
  const seed=(Date.now() ^ Math.floor(Math.random()*0xffffffff))>>>0;
  const rng=mulberry32(seed);
  if(sectionId==='math') state.questions=drawMathSection(MATH_QUESTIONS,section,rng);
  else if(sectionId==='english') state.questions=drawEnglishSection(ENGLISH_PASSAGES,section,rng);
  else if(sectionId==='reading') state.questions=drawReadingSection(READING_PASSAGES,section,rng);
  else throw new Error(`Section ${sectionId} is not implemented`);
  state.sectionId=sectionId;
  state.responses={}; state.index=0; state.startedAt=Date.now(); state.secondsLeft=section.minutes*60;
  $('#home').hidden=true; $('#practice').hidden=false; $('#results').hidden=true;
  clearInterval(state.timer); state.timer=setInterval(()=>{ state.secondsLeft=Math.max(0,state.secondsLeft-1); $('#timer').textContent=formatTime(state.secondsLeft); if(!state.secondsLeft) finish(); },1000);
  renderQuestion();
}

function renderQuestion() {
  const q=state.questions[state.index];
  $('#timer').textContent=formatTime(state.secondsLeft);
  $('#progress').textContent=`${SECTIONS[state.sectionId].label} · Question ${state.index+1} of ${state.questions.length}`;
  const passage=$('#passage-panel');
  if(q.passageText){
    passage.hidden=false;
    $('#passage-title').textContent=q.passageTitle;
    const format=q.passageFormat && q.passageFormat!=='single' ? ` · ${q.passageFormat.toUpperCase()} format` : '';
    $('#passage-meta').textContent=`${q.passageGenre} passage${format} · question ${q.passageQuestionNumber} of ${q.passageQuestionCount} in this set`;
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
  $('#prev').disabled=state.index===0; $('#next').textContent=state.index===state.questions.length-1?'Finish':'Next';
}

$('#prev').addEventListener('click',()=>{ if(state.index>0){state.index--;renderQuestion();} });
$('#next').addEventListener('click',()=>{ if(state.index===state.questions.length-1) finish(); else {state.index++;renderQuestion();} });
$('#exit').addEventListener('click',()=>{ if(confirm('End this practice attempt?')) {clearInterval(state.timer);renderHome();} });

function finish() {
  clearInterval(state.timer);
  const sectionId=state.sectionId;
  const result=scoreResponses(state.questions,state.responses,sectionId);
  $('#practice').hidden=true; $('#results').hidden=false;
  $('#result-section').textContent=SECTIONS[sectionId].label;
  $('#score-estimate').textContent=`${result.estimate}`;
  $('#score-range').textContent=result.low===result.high?`${result.low}`:`${result.low}–${result.high}`;
  $('#raw-score').textContent=`${result.raw} / ${result.maxRaw}`;
  const rows=$('#category-results'); rows.innerHTML='';
  Object.entries(result.categories).forEach(([cat,v])=>{
    const div=document.createElement('div'); div.className='result-row'; div.innerHTML=`<span>${CATEGORY_LABELS[sectionId]?.[cat]||cat}</span><strong>${v.correct}/${v.total}</strong>`; rows.appendChild(div);
  });
}

$('#home-again').addEventListener('click',renderHome);
renderHome();
