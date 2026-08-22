export const SCIENCE_EXPANSION_DATA_REPRESENTATION_SETS = Object.freeze([
  {
    id:"S-DR-SOLUBILITY",
    title:"Potassium Nitrate Solubility",
    format:"DR",
    domain:"chemistry",
    text:`A student measured the maximum mass of potassium nitrate (KNO3) that dissolved in 100 g of water at several temperatures. A saturated solution contains the maximum amount that dissolves under the stated conditions.\n\nTemperature (°C) | KNO3 dissolved (g per 100 g water)\n10 | 21\n20 | 32\n30 | 46\n40 | 64\n50 | 86\n\nThe student used the same mass of water at every temperature and stirred each mixture for the same length of time before determining whether additional solid would dissolve.`,
    questions:[
      {id:"S-DR-SOLUBILITY-1",category:"IOD",stem:"According to the table, how many grams of KNO3 dissolved in 100 g of water at 40°C?",choices:["46 g","64 g","86 g","32 g"],correct:"B",rationale:"The table lists 64 g of dissolved KNO3 per 100 g water at 40°C."},
      {id:"S-DR-SOLUBILITY-2",category:"IOD",stem:"From 20°C to 50°C, the measured solubility increased by:",choices:["22 g","32 g","54 g","86 g"],correct:"C",rationale:"The solubility rises from 32 g at 20°C to 86 g at 50°C, an increase of 54 g."},
      {id:"S-DR-SOLUBILITY-3",category:"IOD",stem:"Which statement best describes the pattern in the data?",choices:["Solubility decreases by an equal amount for each 10°C increase.","Solubility remains nearly constant above 30°C.","Solubility increases as temperature increases, with larger gains at the higher listed temperatures.","The highest solubility occurs at 10°C."],correct:"C",rationale:"Every temperature increase is associated with greater solubility, and the increments grow from 11 g to 22 g across successive intervals."},
      {id:"S-DR-SOLUBILITY-4",category:"SIN",stem:"Why was it useful to keep the mass of water the same in every trial?",choices:["It allows solubility values at different temperatures to be compared on the same basis.","It guarantees that all solid dissolves at every temperature.","It makes water temperature the dependent variable.","It prevents the solution from becoming saturated."],correct:"A",rationale:"Holding water mass constant prevents differing solvent amounts from confounding the comparison of solubility across temperatures."},
      {id:"S-DR-SOLUBILITY-5",category:"EAM",backgroundKnowledge:true,stem:"A saturated solution prepared at 50°C is cooled to 20°C without losing water. Based on the table, which outcome is most likely?",choices:["Some KNO3 crystallizes from solution.","More KNO3 must dissolve immediately.","The water changes into a different element.","The amount dissolved must stay at 86 g because temperature cannot affect solubility."],correct:"A",rationale:"The table shows that much less KNO3 can remain dissolved at 20°C than at 50°C, so excess solute is expected to crystallize as the solution cools."}
    ]
  },
  {
    id:"S-DR-SOLAR",
    title:"Solar-Panel Tilt and Power Output",
    format:"DR",
    domain:"physics",
    engineeringDesign:true,
    text:`A design team tested one solar panel at four fixed tilt angles. The panel area, orientation toward south, electrical load, and measurement equipment were unchanged. Power output was recorded once in the morning and once near solar noon on a clear day.\n\nPanel tilt | Morning power (W) | Noon power (W)\n0° | 92 | 181\n20° | 126 | 207\n40° | 158 | 221\n60° | 174 | 199\n\nThe team wants to choose a fixed tilt for a device that must operate throughout the daylight period rather than only at noon.`,
    questions:[
      {id:"S-DR-SOLAR-1",category:"IOD",stem:"Which tilt produced the greatest noon power in the test?",choices:["0°","20°","40°","60°"],correct:"C",rationale:"The noon column reaches its highest listed value, 221 W, at a 40° tilt."},
      {id:"S-DR-SOLAR-2",category:"IOD",stem:"How much greater was morning power at 60° than at 0°?",choices:["82 W","107 W","18 W","273 W"],correct:"A",rationale:"Morning output increases from 92 W at 0° to 174 W at 60°, a difference of 82 W."},
      {id:"S-DR-SOLAR-3",category:"IOD",stem:"Which conclusion is supported by both measurement columns?",choices:["Increasing tilt always increases power at every time of day.","The tilt with the highest morning output is not the tilt with the highest noon output.","A horizontal panel produces more power than every tilted panel.","Noon output is identical at all four tilts."],correct:"B",rationale:"Morning output is highest at 60°, whereas noon output is highest at 40°."},
      {id:"S-DR-SOLAR-4",category:"SIN",stem:"Which additional measurement would best help the team choose a tilt for all-day operation?",choices:["Power at several additional times between sunrise and sunset","The color of the panel frame after testing","The mass of the data table in grams","One more noon measurement only"],correct:"A",rationale:"Measurements across the day would show how each fixed tilt performs over the full operating period the design must serve."},
      {id:"S-DR-SOLAR-5",category:"EAM",backgroundKnowledge:true,stem:"Why can panel tilt affect electrical power output?",choices:["Tilt changes how directly sunlight strikes the panel surface.","Tilt changes the chemical identity of sunlight.","A tilted panel creates electrical energy without receiving radiation.","Gravity stops acting on a panel at 40°."],correct:"A",rationale:"The angle between incoming light and the panel affects the solar energy received per unit area, which can change electrical output."}
    ]
  }
]);
