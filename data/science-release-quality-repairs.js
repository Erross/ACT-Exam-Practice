export const SCIENCE_RELEASE_QUALITY_REPAIRS = Object.freeze({
  "S-RS-DISSOLUTION-4": {choice:"B",text:"Change temperature, solute mass, water volume, and stirring rate together, then compare the resulting dissolving times as one combined treatment."},
  "S-RS-SPRING-4": {choice:"B",text:"To make the spring permanently longer after each trial so later extension readings become easier to distinguish from the unloaded position."},
  "S-RS-SEEDS-4": {choice:"B",text:"To increase the salt concentration without adding more salt, allowing the students to compare a stronger treatment with the original dishes."},
  "S-RS-SEEDS-6": {choice:"B",text:"eliminate cellular membranes from the seed rapidly enough that water can enter without crossing a selectively permeable barrier."},
  "S-RS-WATERFILTER-5": {choice:"B",text:"cause suspended particles to lose enough mass during passage that the remaining material no longer contributes substantially to measured turbidity."},
  "S-RS-CIRCUIT-5": {choice:"B",text:"Greater series resistance was associated with higher current and higher housing temperature because more electrical energy was released by the resistor."},
  "S-RS-CIRCUIT-6": {choice:"B",text:"increase current because the additional resistance supplies electrical charge that the source can then move through the LED circuit."},
  "S-CV-CORROSION-2": {choice:"B",text:"Use a different steel alloy, salt concentration, exposure schedule, duration, and temperature in every trial, then compare the final mass losses."},
  "S-CV-CORROSION-5": {choice:"B",text:"Chloride exposure is the dominant factor in these trials, while wet-dry cycling mainly changes how quickly the chloride reaches the metal surface."},
  "S-CV-SEABREEZE-2": {choice:"B",text:"Measure sea-surface temperature at noon on many days and compare those values with afternoon coastal wind direction without collecting regional-pressure data."},
  "S-CV-SEABREEZE-3": {choice:"B",text:"Regional wind can influence a coastal station strongly enough to modify the wind direction that would otherwise follow local daytime heating."},
  "S-CV-SEABREEZE-4": {choice:"B",text:"the land was warmer than the sea, so the local temperature contrast by itself provides a complete explanation for the observed onshore flow."},
  "S-CV-SEABREEZE-5": {choice:"B",text:"temperature is the primary control on coastal wind direction whenever skies are clear and the land surface receives strong daytime sunlight."},
  "S-CV-SEABREEZE-6": {choice:"B",text:"Land warms faster because soil and rock transfer relatively little solar energy downward compared with the mixing that distributes energy through water."},
});

export function applyScienceReleaseQualityRepairs(sets){
  return sets.map(set=>({
    ...set,
    questions:set.questions.map(question=>{
      const repair=SCIENCE_RELEASE_QUALITY_REPAIRS[question.id];
      if(!repair) return question;
      const index="ABCD".indexOf(repair.choice);
      if(index<0 || repair.choice===question.correct) throw new Error(`Invalid Science release-quality repair for ${question.id}`);
      const choices=[...question.choices];
      choices[index]=repair.text;
      return {...question,choices};
    }),
  }));
}
