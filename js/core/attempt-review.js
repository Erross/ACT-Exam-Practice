export function attemptStatus(questions,responses,flags={}){
  let answered=0;
  let flagged=0;
  for(const question of questions){
    if(responses[question.id]!==undefined && responses[question.id]!==null && responses[question.id]!=="") answered++;
    if(Boolean(flags[question.id])) flagged++;
  }
  return {
    total:questions.length,
    answered,
    unanswered:questions.length-answered,
    flagged,
  };
}

export function buildAnswerReview(questions,responses){
  return questions.map((question,index)=>({
    id:question.id,
    number:index+1,
    stem:question.stem,
    choices:[...question.choices],
    correct:question.correct,
    response:responses[question.id] ?? null,
    rationale:question.rationale,
    scored:question.scored!==false,
  }));
}

export function answerText(reviewItem,letter){
  if(!letter) return "No answer";
  const index="ABCD".indexOf(letter);
  if(index<0 || index>=reviewItem.choices.length) return "No answer";
  return `${letter}. ${reviewItem.choices[index]}`;
}
