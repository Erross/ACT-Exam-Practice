export const ENGLISH_STEM_REPAIRS = Object.freeze({
  "E-L1-Q2": "In sentence 2, which punctuation best separates the introductory phrase from the main clause?",
  "E-L1-Q4": "Which choice correctly completes the beginning of the clause in sentence 3: ‘so that ___ basic maintenance skills’ ?",
  "E-L3-Q5": "The writer wants sentence 6 to support the claim in sentence 5. Which choice for sentence 6 best accomplishes this goal?",
  "E-L3-Q8": "Which choice best begins sentence 10 while linking it to the mapping-and-matching process described just before it?",
});

export function applyEnglishStemRepairs(passages){
  return passages.map(passage=>({
    ...passage,
    questions:passage.questions.map(question=>{
      const stem=ENGLISH_STEM_REPAIRS[question.id];
      return stem ? {...question,stem} : question;
    }),
  }));
}
