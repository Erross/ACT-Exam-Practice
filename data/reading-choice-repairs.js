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

  "R-INFO-HEAT-1": { choice:"D", text:"should focus on emergency cooling centers rather than street design because short-term alerts reach residents more efficiently than permanent changes." },
  "R-INFO-HEAT-2": { choice:"B", text:"Mature trees cannot cool air through evapotranspiration when they are planted beside paved streets or public transportation routes." },
  "R-INFO-HEAT-3": { choice:"D", text:"People generally prefer darker pavement because reflected radiation from lighter surfaces makes pedestrian environments less comfortable overall." },
  "R-INFO-HEAT-4": { choice:"D", text:"which tree species grow fastest in compacted soil and therefore should receive priority over other street-level cooling interventions." },
  "R-INFO-HEAT-5": { choice:"B", text:"cities should stop collecting metropolitan temperature data because neighborhood observations provide a more complete picture of urban heat risk." },
  "R-INFO-HEAT-6": { choice:"D", text:"argue that pedestrian thermal comfort cannot be studied reliably when reflective pavement changes both surface temperature and radiation." },
  "R-INFO-HEAT-7": { choice:"A", text:"a chronological account of how city heat planning moved from emergency response to tree planting, pavement changes, and resident surveys." },
  "R-INFO-HEAT-8": { choice:"A", text:"A project that lowers surface temperature should be prioritized over programs focused on access to cooling because measured heat reduction is the most reliable outcome." },
  "R-INFO-HEAT-9": { choice:"B", text:"temperature measurements are too unreliable for planning because neighborhoods with similar readings can still contain different buildings and residents." },

  "R-INFO-RESTORE-1": { choice:"A", text:"replaces most engineered flood protection with unrestricted river movement so channels and floodplains can return to their earlier physical patterns." },
  "R-INFO-RESTORE-2": { choice:"B", text:"sediment carried onto floodplains generally remains suspended long enough to prevent meaningful deposition as water leaves the main channel." },
  "R-INFO-RESTORE-3": { choice:"C", text:"It allows managers to defer defining acceptable erosion and habitat goals until after the restored river has adjusted to several floods." },
  "R-INFO-RESTORE-4": { choice:"D", text:"a reason to reconstruct the original rigid channel whenever newly connected channels or gravel bars shift substantially after a flood." },
  "R-INFO-RESTORE-5": { choice:"C", text:"increasing the width of each restored channel by a similar amount so floodwater spreads predictably regardless of surrounding land use." },
  "R-INFO-RESTORE-6": { choice:"D", text:"restored rivers should be judged mainly by whether their appearance closely resembles rivers that have not recently been engineered." },
  "R-INFO-RESTORE-8": { choice:"B", text:"Ecological goals should receive priority over infrastructure concerns when added habitat could compensate for impacts to bridges, fields, or trails." },
  "R-INFO-RESTORE-9": { choice:"D", text:"River projects work best when managers avoid fixed numerical targets and rely instead on observed channel behavior after restoration." },
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
