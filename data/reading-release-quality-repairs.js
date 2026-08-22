export const READING_RELEASE_QUALITY_REPAIRS = Object.freeze({
  "R-LIT-OBSERVATORY-1": {choice:"B",text:"Automated weather stations make human observations largely unnecessary once the instruments collect enough variables consistently over time."},
  "R-LIT-OBSERVATORY-2": {choice:"B",text:"He wants visitors to write their names and weather impressions in it during the public viewing sessions that follow maintenance work."},
  "R-LIT-OBSERVATORY-3": {choice:"B",text:"The observatory had once planned to move to a different hill after the final 1994 entries were recorded in the notebook."},
  "R-LIT-OBSERVATORY-4": {choice:"B",text:"The telescope can no longer point toward the eastern horizon because surrounding trees now block that section of the sky."},
  "R-LIT-OBSERVATORY-5": {choice:"B",text:"a maintenance manual for replacing worn parts in the dome mechanism and keeping the telescope aligned during public sessions."},
  "R-LIT-OBSERVATORY-6": {choice:"B",text:"avoiding numerical instruments whenever observers can describe weather and equipment conditions carefully enough in written notes."},
  "R-LIT-OBSERVATORY-7": {choice:"B",text:"show that the weather station had stopped operating correctly during the crowded public viewing session that evening."},
  "R-LIT-OBSERVATORY-8": {choice:"B",text:"The notebook was stored in the lowest drawer of a metal desk alongside older equipment records and receipts."},
  "R-LIT-OBSERVATORY-9": {choice:"B",text:"Discard the notebook once the weather station has collected several years of consistent measurements under present-day conditions."},

  "R-LIT-KILN-1": {choice:"B",text:"A handmade gift succeeds mainly when it matches the maker's original design and intended surface colors as closely as possible."},
  "R-LIT-KILN-2": {choice:"B",text:"The bowls all have the same rounded profile and carved line, suggesting Luis prepared the clay and glaze consistently."},
  "R-LIT-KILN-3": {choice:"B",text:"The upper shelf reached a higher maximum temperature than the kiln center even though the thermocouple was positioned elsewhere."},
  "R-LIT-KILN-4": {choice:"B",text:"He learns that ceramic glaze generally should not be heated twice because another firing can alter the surface unpredictably."},
  "R-LIT-KILN-5": {choice:"B",text:"Luis quickly forgets what the witness cone showed because he is more interested in finishing another firing before the birthday."},
  "R-LIT-KILN-6": {choice:"B",text:"claim that the blue-and-brown pattern was the exact weather effect Luis had intended to paint before the bowls entered the kiln."},
  "R-LIT-KILN-7": {choice:"B",text:"make another birthday gift; instead, he decides to study the firing process before making additional ceramic pieces."},
  "R-LIT-KILN-8": {choice:"B",text:"Luis's mother has kept an elementary-school pinch pot for years despite its uneven shape, rough surface, and obvious imperfections."},
  "R-LIT-KILN-9": {choice:"B",text:"evidence that handmade objects can remain meaningful even when the original plan changes during the production process."},

  "R-INFO-NOISE-1": {choice:"B",text:"replacing resident complaints with a citywide decibel average collected from permanent sensors in representative neighborhoods and time periods."},
  "R-INFO-NOISE-2": {choice:"B",text:"Average sound levels cannot be compared reliably unless neighborhoods share similar building materials, street designs, and measurement schedules."},
  "R-INFO-NOISE-3": {choice:"B",text:"A microphone records most accurately beside a reflective wall when it is mounted at the same height as nearby windows."},
  "R-INFO-NOISE-4": {choice:"B",text:"A calibrated numerical measure of sound pressure at every address during each hour residents are most likely to be home."},
  "R-INFO-NOISE-5": {choice:"B",text:"continuous monitoring creates so much data that shorter schedules are generally preferable even when a source occurs only intermittently."},
  "R-INFO-NOISE-6": {choice:"B",text:"cannot display sound data geographically until analysts have collected enough resident surveys to classify each neighborhood accurately."},
  "R-INFO-NOISE-7": {choice:"B",text:"introduce a new technical method for calibrating microphones after comparing results from permanent sensors and portable meters."},
  "R-INFO-NOISE-8": {choice:"B",text:"They help confirm that traffic volume and weather were similar enough that analysts can disregard most other local changes."},
  "R-INFO-NOISE-9": {choice:"B",text:"Measure one downtown intersection repeatedly across several days and use its average as the city's reference condition for comparison."},

  "R-INFO-PAIRED-TREES-1": {choice:"B",text:"remove healthy mature trees according to a fixed age schedule so replacement planting can be coordinated several years in advance."},
  "R-INFO-PAIRED-TREES-2": {choice:"B",text:"give mature canopy benefits more weight than structural defects whenever inspections do not predict an immediate failure."},
  "R-INFO-PAIRED-TREES-3": {choice:"B",text:"declining trees should be removed as soon as any defect becomes visible, provided replacement planting has already been scheduled."},
  "R-INFO-PAIRED-TREES-4": {choice:"B",text:"Mature trees can delay the growth of nearby replacements, so overlap should be limited to sites with extra planting space."},
  "R-INFO-PAIRED-TREES-5": {choice:"B",text:"makes professional tree inspection less important because replacement timing can be decided from planting records and species diversity."},
  "R-INFO-PAIRED-TREES-6": {choice:"B",text:"whether trees provide enough summer shade to justify the cost of repeated professional inspections, pruning, and maintenance."},
  "R-INFO-PAIRED-TREES-7": {choice:"B",text:"a refusal to plan for eventual replacement while mature canopy continues to provide useful shade and neighborhood cooling."},
  "R-INFO-PAIRED-TREES-8": {choice:"B",text:"A survey comparing residents' preferred tree species, shade levels, and opinions about removal timing across several neighborhoods."},
  "R-INFO-PAIRED-TREES-9": {choice:"B",text:"Keep declining trees through repeated inspection until risk becomes difficult to manage, then plant replacements only after removal."},
});

export function applyReadingReleaseQualityRepairs(passages){
  return passages.map(passage=>({
    ...passage,
    questions:passage.questions.map(question=>{
      const repair=READING_RELEASE_QUALITY_REPAIRS[question.id];
      if(!repair) return question;
      const index="ABCD".indexOf(repair.choice);
      if(index<0 || repair.choice===question.correct) throw new Error(`Invalid Reading release-quality repair for ${question.id}`);
      const choices=[...question.choices];
      choices[index]=repair.text;
      return {...question,choices};
    }),
  }));
}
