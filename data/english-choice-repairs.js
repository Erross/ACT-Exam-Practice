export const ENGLISH_CHOICE_REPAIRS = Object.freeze({
  "E-L1-Q3": { choice:"B", text:"make repairs for visitors and then explain each step after the work is complete" },
});

export function applyEnglishChoiceRepairs(passages){
  return passages.map(passage=>({
    ...passage,
    questions:passage.questions.map(question=>{
      const repair=ENGLISH_CHOICE_REPAIRS[question.id];
      if(!repair) return question;
      const index="ABCD".indexOf(repair.choice);
      if(index<0 || repair.choice===question.correct) throw new Error(`Invalid English choice repair for ${question.id}`);
      const choices=[...question.choices];
      choices[index]=repair.text;
      return {...question,choices};
    }),
  }));
}
