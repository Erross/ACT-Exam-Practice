export const ENGLISH_RELEASE_QUALITY_REPAIRS = Object.freeze({
  "E-L7-Q3": {choice:"B",text:"It begins a new argument that microphones make volunteer listening less trustworthy than the earlier clipboard observations."},
  "E-L7-Q4": {choice:"B",text:"It claims that repeated listening and standardized recording remove uncertainty from comparisons among different sites and nights."},
  "E-L9-Q3": {choice:"B",text:"dismiss critics by suggesting that installation and maintenance costs are too minor to affect the proposed limited pilot."},
  "E-L9-Q4": {choice:"B",text:"It introduces a new estimate of shelter costs and argues that those costs should determine whether riders wait comfortably."},
  "E-S7-Q2": {choice:"B",text:"It argues that successful murals should remain permanently in the hallway so future classes can study the same work."},
  "E-S7-Q3": {choice:"B",text:"a damaged display that the school repairs repeatedly rather than rotating with new student artwork."},
  "E-S8-Q1": {choice:"B",text:"To argue that libraries should provide professional electrical and heating inspections whenever patrons discover unusual readings in borrowed kits"},
  "E-S8-Q2": {choice:"B",text:"show that the library no longer needs to lend repair books because the kits provide enough information for most household problems."},
  "E-S9-Q2": {choice:"B",text:"The teacher wanted Jonah to purchase a more expensive case after learning how long the damaged one had been used."},
  "E-S10-Q1": {choice:"B",text:"Automated rain gauges remove the need for students to compare measurements manually once all schools use the same maintenance schedule."},
  "E-S10-Q2": {choice:"B",text:"It argues that each school should use a different rain gauge so students can compare instrument designs during the same storm."},
});

export function applyEnglishReleaseQualityRepairs(passages){
  return passages.map(passage=>({
    ...passage,
    questions:passage.questions.map(question=>{
      const repair=ENGLISH_RELEASE_QUALITY_REPAIRS[question.id];
      if(!repair) return question;
      const index="ABCD".indexOf(repair.choice);
      if(index<0 || repair.choice===question.correct) throw new Error(`Invalid English release-quality repair for ${question.id}`);
      const choices=[...question.choices];
      choices[index]=repair.text;
      return {...question,choices};
    }),
  }));
}
