const LETTERS="ABCD";

function moveCorrectChoice(question,targetIndex){
  const sourceIndex=LETTERS.indexOf(question.correct);
  if(sourceIndex<0 || !Array.isArray(question.choices) || question.choices.length!==4){
    throw new Error(`Cannot normalize answer position for ${question.id}`);
  }
  if(targetIndex<0 || targetIndex>3) throw new Error(`Invalid target answer position for ${question.id}`);
  if(sourceIndex===targetIndex) return question;
  const choices=[...question.choices];
  [choices[sourceIndex],choices[targetIndex]]=[choices[targetIndex],choices[sourceIndex]];
  return {...question,choices,correct:LETTERS[targetIndex]};
}

export function rebalanceQuestions(questions){
  return questions.map((question,index)=>moveCorrectChoice(question,index%4));
}

export function rebalanceGroupedQuestions(groups){
  let ordinal=0;
  return groups.map(group=>({
    ...group,
    questions:group.questions.map(question=>moveCorrectChoice(question,ordinal++%4)),
  }));
}
