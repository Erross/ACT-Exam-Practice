export const SCIENCE_CHOICE_REPAIRS = Object.freeze({
  "S-DR-LEAF-4": { choice:"B", text:"The number of disks that float at each time point, because that outcome should be fixed before the light intensity is changed." },
  "S-DR-STREAM-3": { choice:"C", text:"Rainfall and turbidity decreased together on every day after the largest storm, showing the same recovery pattern throughout the study." },
  "S-DR-STREAM-4": { choice:"B", text:"The total number and length of drainage paths that could carry runoff toward the monitored stream during storm events." },
  "S-DR-STREAM-5": { choice:"B", text:"Rainfall during a storm may dilute suspended material rapidly, so turbidity should remain elevated only while precipitation continues at the station." },
  "S-RS-PLANTS-4": { choice:"B", text:"To make all seedlings receive effectively identical growing conditions so fertilizer and water could not influence one another." },
  "S-RS-PLANTS-5": { choice:"C", text:"Fertilizer had no meaningful relationship with growth because the 8 g group was only somewhat taller than the unfertilized group after 21 days." },
  "S-RS-PENDULUM-3": { choice:"B", text:"Because the student had already determined that a 0.75 m string produced the most precise measurements and wanted to keep the best-performing length." },
  "S-RS-PENDULUM-4": { choice:"C", text:"Timing ten swings allows the string length and bob speed to stabilize before the period is calculated from the total elapsed time." },
  "S-RS-PENDULUM-5": { choice:"D", text:"Period decreased as both string length and bob mass increased, although the effect of mass was smaller than the effect of length." },
  "S-RS-CATALYST-3": { choice:"B", text:"To guarantee that every trial had a different reaction rate while still allowing catalyst amount and temperature to be compared directly." },
  "S-RS-CATALYST-5": { choice:"B", text:"Catalyst mass had little meaningful effect on reaction rate because every catalyzed trial eventually produced the same 40 mL volume of gas." },
  "S-RS-CATALYST-6": { choice:"C", text:"changes the identity of intermediate and product molecules so that fewer reactant-particle collisions are required for gas to form." },
  "S-RS-INFILTRATION-5": { choice:"B", text:"Dry weather increased infiltration across the treatments because the lower second-trial values indicate that more water entered each soil before measurement ended." },
  "S-RS-INFILTRATION-6": { choice:"B", text:"The loosened treatment exceeds compacted soil in both listed trials, with a similar advantage before and after the week of dry weather." },
  "S-CV-BRIDGE-2": { choice:"B", text:"Increase structural damping over several levels while keeping natural frequency and deck shape nearly unchanged, then compare only the maximum twisting amplitude." },
  "S-CV-BRIDGE-3": { choice:"C", text:"the large reduction in amplitude after damping was added shows that damping alone determines the onset wind speed regardless of aerodynamic shape or natural frequency." },
  "S-CV-BRIDGE-4": { choice:"B", text:"Different fairing shapes produce different onset speeds even when structural natural frequency changes little, while damping changes amplitude without substantially shifting onset." },
});

export function applyScienceChoiceRepairs(sets){
  return sets.map(set=>({
    ...set,
    questions:set.questions.map(question=>{
      const repair=SCIENCE_CHOICE_REPAIRS[question.id];
      if(!repair) return question;
      const index="ABCD".indexOf(repair.choice);
      if(index<0 || repair.choice===question.correct) throw new Error(`Invalid Science choice repair for ${question.id}`);
      const choices=[...question.choices];
      choices[index]=repair.text;
      return {...question,choices};
    }),
  }));
}
