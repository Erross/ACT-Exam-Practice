export const MATH_CHOICE_REPAIRS = Object.freeze({
  "M-F-DOMAIN-RATIONAL-2": {
    A:"0",
    B:"3",
  },
});

export function applyMathChoiceRepairs(questions){
  return questions.map(question=>{
    const repairs=MATH_CHOICE_REPAIRS[question.id];
    if(!repairs) return question;
    const choices=[...question.choices];
    for(const [letter,text] of Object.entries(repairs)){
      const index="ABCD".indexOf(letter);
      if(index<0 || letter===question.correct) throw new Error(`Invalid Math choice repair for ${question.id} ${letter}`);
      choices[index]=text;
    }
    return {...question,choices};
  });
}
