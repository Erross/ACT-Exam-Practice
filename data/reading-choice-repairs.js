export const READING_CHOICE_REPAIRS = Object.freeze({
  "R-LIT-ARCHIVE-1": { choice:"C", text:"Old neighborhoods should be restored to their original design even when current residents prefer newer uses for the land." },
  "R-LIT-ARCHIVE-2": { choice:"C", text:"Her grandfather had asked her to preserve his filing system and keep every document in exactly the place where he had left it." },
  "R-LIT-ARCHIVE-3": { choice:"A", text:"It marks a highway that was never constructed and was eventually replaced by the highway north of the courthouse square." },
  "R-LIT-ARCHIVE-4": { choice:"B", text:"a survey marker that would identify the exact boundary her grandfather had measured years earlier." },
  "R-LIT-ARCHIVE-5": { choice:"D", text:"the labels on the boxes were difficult to interpret because the handwriting had faded while the house sat empty for years." },
  "R-LIT-ARCHIVE-6": { choice:"B", text:"proof that official maps emphasize proposed construction more than the informal paths residents once used, making them incomplete records of the town." },
  "R-LIT-ARCHIVE-7": { choice:"D", text:"demonstrate that the original labels were inaccurate because each box actually contained a single clearly defined category of material." },
  "R-LIT-ARCHIVE-8": { choice:"D", text:"Mara carries one folded map so she can compare it carefully with every street and building she encounters while walking through Linden." },
  "R-LIT-ARCHIVE-9": { choice:"B", text:"proving that her grandfather personally built the garden and organized the children and adults shown in every photograph." },
  "R-LIT-NIGHTSHIFT-1": { choice:"D", text:"passengers usually understand how severe weather changes each route better than dispatchers or experienced drivers do." },
  "R-LIT-NIGHTSHIFT-2": { choice:"D", text:"He has been instructed not to carry any more passengers because dispatch wants every bus returned empty to the depot." },
  "R-LIT-NIGHTSHIFT-3": { choice:"C", text:"He cannot recognize his usual stop because the snow has hidden the furniture store and the surrounding landmarks." },
  "R-LIT-NIGHTSHIFT-4": { choice:"B", text:"The connecting bus arrives despite the storm and takes the older man directly back to the hospital without any additional delay." },
  "R-LIT-NIGHTSHIFT-6": { choice:"D", text:"likely to confuse the nurses who had boarded near the hospital and were already worried about reaching home safely." },
  "R-LIT-NIGHTSHIFT-7": { choice:"C", text:"every bus line operated by Eli's company, including the schedules, transfer rules, and terminal procedures used throughout the system." },
  "R-LIT-NIGHTSHIFT-8": { choice:"A", text:"Dispatch announces that lane markers are covered and tells drivers that normal stopping rules have been suspended for the storm." },
  "R-LIT-NIGHTSHIFT-9": { choice:"D", text:"drivers should make transportation decisions for their passengers whenever weather or passenger mistakes make the printed schedule difficult to follow." },
});

export function applyReadingChoiceRepairs(passages){
  return passages.map(passage=>({
    ...passage,
    questions:passage.questions.map(question=>{
      const repair=READING_CHOICE_REPAIRS[question.id];
      if(!repair) return question;
      const index="ABCD".indexOf(repair.choice);
      if(index<0 || repair.choice===question.correct) throw new Error(`Invalid Reading choice repair for ${question.id}`);
      const choices=[...question.choices];
      choices[index]=repair.text;
      return {...question,choices};
    }),
  }));
}
