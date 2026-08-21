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

  "S-DR-SOLUBILITY-3": { choice:"A", text:"Solubility decreases by the same amount for every 10°C increase, producing a steady downward relationship across all five temperatures in the table." },
  "S-DR-SOLUBILITY-4": { choice:"D", text:"It prevents the solution from becoming saturated at any tested temperature, ensuring that every portion of solid KNO3 must eventually dissolve." },
  "S-DR-SOLAR-3": { choice:"A", text:"Increasing tilt always increases power at both measurement times, so the steepest tested angle performs best regardless of the sun's position." },
  "S-DR-SOLAR-4": { choice:"D", text:"One additional noon measurement at the same four tilts would be sufficient to determine which fixed tilt performs best throughout the entire daylight period." },

  "S-RS-ENZYME-4": { choice:"C", text:"To ensure temperature could not affect catalase activity, allowing oxygen production to be attributed entirely to differences among the potato cylinders." },
  "S-RS-ENZYME-5": { choice:"A", text:"Catalase activity increased continuously from 5°C through 65°C, with each warmer treatment producing more oxygen than the treatment immediately below it." },
  "S-RS-ENZYME-6": { choice:"C", text:"Enzymes always work faster as temperature rises because increasing molecular motion prevents proteins from losing the structures required for catalysis." },

  "S-RS-RUNOFF-3": { choice:"A", text:"Slope angle was held constant between the two rounds of testing so the team could compare erosion-control treatments without changing the steepness of the trays." },
  "S-RS-RUNOFF-4": { choice:"B", text:"Compare the fiber mat with bare soil while simultaneously changing rainfall volume, slope angle, soil type, and pin spacing for each treatment." },
  "S-RS-RUNOFF-5": { choice:"C", text:"Increasing slope reduced sediment loss in every treatment, indicating that steeper ground allowed more water to infiltrate before it could transport soil." },
  "S-RS-RUNOFF-6": { choice:"D", text:"Ground cover guarantees that rainfall cannot enter the soil, so runoff loses the water needed to detach and transport sediment downslope." },

  "S-RS-INSULATION-3": { choice:"B", text:"To force every cup to cool at exactly the same rate regardless of sleeve material, making any remaining temperature differences easier to average." },
  "S-RS-INSULATION-4": { choice:"C", text:"Use a different starting water temperature for every sleeve material, then compare the final temperatures without accounting for the initial differences." },
  "S-RS-INSULATION-5": { choice:"B", text:"Doubling the foam thickness caused the water to cool faster than the unsleeved cup, showing that added insulation increased thermal-energy transfer." },
  "S-RS-INSULATION-6": { choice:"C", text:"A useful insulator creates thermal energy inside the cup at a rate that offsets cooling, even when no external energy source is connected to the system." },

  "S-CV-BLOOM-1": { choice:"B", text:"The two strongest blooms occurred during years with low phosphorus input and prolonged cool, windy conditions that mixed the water column continuously." },
  "S-CV-BLOOM-2": { choice:"C", text:"Compare only years in which phosphorus and temperature changed together in the same direction, without creating treatments that vary either factor independently." },
  "S-CV-BLOOM-3": { choice:"B", text:"Weather can influence algal conditions by changing water temperature and mixing, even though that general statement is not contradicted by the high-phosphorus cool year." },
  "S-CV-BLOOM-4": { choice:"B", text:"Phosphorus can enter lakes from surrounding watersheds during runoff events, a mechanism that remains possible regardless of what happened in the warm low-phosphorus year." },
  "S-CV-BLOOM-5": { choice:"D", text:"The records prove that phosphorus supply and warm, calm weather never interact, because each variable should be interpreted as a completely independent cause of blooms." },
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
