export const MATH_CLEANROOM_REPAIRS = Object.freeze({
  "M-IES-WORK-2": Object.freeze({
    stem:"A crew paints area equal to 3/5 of a standard wall in 4 hours at a constant rate. In 10 hours, how many standard-wall equivalents of area can the crew paint?",
    rationale:"The rate is (3/5)/4 = 3/20 standard-wall equivalent per hour. In 10 hours, the crew can paint 10(3/20)=30/20=3/2 standard-wall equivalents of area.",
  }),
});

export function applyMathCleanroomRepairs(questions){
  return questions.map(question=>{
    const repair=MATH_CLEANROOM_REPAIRS[question.id];
    return repair ? {...question,...repair} : question;
  });
}
