export const SCIENCE_DATA_REPRESENTATION_SETS = Object.freeze([
  {
    id:"S-DR-LEAF",
    title:"Leaf-Disk Photosynthesis",
    format:"DR",
    domain:"life",
    text:`Students placed equal numbers of spinach leaf disks in bicarbonate solution under four light intensities. As photosynthesis produced oxygen inside the disks, buoyant disks rose to the surface. After 12 minutes the students recorded the number of floating disks out of 10.\n\nLight intensity (relative units): 10, 30, 60, 90\nFloating disks after 12 min: 1, 4, 8, 9\n\nA second trial used the same procedure at light intensity 60 but different solution temperatures.\nTemperature (°C): 10, 20, 30, 40\nFloating disks after 12 min: 2, 6, 8, 3`,
    questions:[
      {id:"S-DR-LEAF-1",category:"IOD",stem:"In the light-intensity trial, increasing light intensity from 10 to 60 relative units was associated with what change?",choices:["Floating disks increased from 1 to 8.","Floating disks decreased from 8 to 1.","Temperature increased from 10°C to 60°C.","All 10 disks floated at both intensities."],correct:"A",rationale:"The table lists 1 floating disk at intensity 10 and 8 at intensity 60."},
      {id:"S-DR-LEAF-2",category:"IOD",stem:"Which light-intensity interval shows the smallest increase in the number of floating disks?",choices:["10 to 30","30 to 60","60 to 90","All intervals show the same increase."],correct:"C",rationale:"The increases are +3, +4, and +1; the smallest is from 60 to 90."},
      {id:"S-DR-LEAF-3",category:"IOD",stem:"At which tested temperature did the greatest number of disks float after 12 minutes?",choices:["10°C","20°C","30°C","40°C"],correct:"C",rationale:"The temperature trial shows 8 floating disks at 30°C, the highest value listed."},
      {id:"S-DR-LEAF-4",category:"SIN",stem:"Which variable should be kept constant when comparing the four light intensities?",choices:["The number of leaf disks placed in each treatment","The number of disks that float","The light intensity","The observed outcome"],correct:"A",rationale:"Keeping the starting number of disks constant makes the treatments comparable while light intensity is deliberately varied."},
      {id:"S-DR-LEAF-5",category:"EAM",backgroundKnowledge:true,stem:"The students use floating as an indirect measure of photosynthesis because oxygen produced during photosynthesis can:",choices:["increase the buoyancy of the leaf disks.","convert the leaf disks directly into bicarbonate.","eliminate all liquid from the container.","reduce the amount of light reaching the leaves."],correct:"A",rationale:"Oxygen accumulating in leaf tissue can make disks more buoyant, linking floating behavior to photosynthetic gas production."}
    ]
  },
  {
    id:"S-DR-STREAM",
    title:"Rainfall and Stream Turbidity",
    format:"DR",
    domain:"earth",
    text:`A monitoring station measured daily rainfall and the turbidity of a stream. Turbidity is reported in nephelometric turbidity units (NTU); higher values indicate more suspended particles in the water.\n\nDay: 1, 2, 3, 4, 5\nRainfall (mm): 0, 4, 28, 6, 0\nStream turbidity (NTU): 3, 4, 21, 13, 6\n\nThe stream's long-term dry-weather turbidity at this station is approximately 3 NTU.`,
    questions:[
      {id:"S-DR-STREAM-1",category:"IOD",stem:"On which day was stream turbidity greatest?",choices:["Day 1","Day 2","Day 3","Day 5"],correct:"C",rationale:"The highest listed turbidity is 21 NTU on Day 3."},
      {id:"S-DR-STREAM-2",category:"IOD",stem:"From Day 3 to Day 5, turbidity changed by approximately:",choices:["an increase of 15 NTU.","a decrease of 15 NTU.","a decrease of 3 NTU.","no change."],correct:"B",rationale:"Turbidity fell from 21 NTU on Day 3 to 6 NTU on Day 5, a decrease of 15 NTU."},
      {id:"S-DR-STREAM-3",category:"IOD",stem:"Which statement best describes the pattern in the table?",choices:["The largest rainfall measurement coincided with the largest turbidity measurement.","Turbidity was lowest on the rainiest day.","Rainfall and turbidity decreased together on every day.","Turbidity remained near 3 NTU throughout the study."],correct:"A",rationale:"Day 3 has both the greatest rainfall, 28 mm, and the greatest turbidity, 21 NTU."},
      {id:"S-DR-STREAM-4",category:"SIN",stem:"To test whether rainfall causes increased turbidity through runoff, which additional measurement would be most useful?",choices:["Suspended-sediment concentration entering the stream from runoff","The color of the monitoring station roof","The number of letters in each day's name","Air pressure inside the laboratory"],correct:"A",rationale:"Measuring sediment delivered by runoff would directly test a mechanism connecting rainfall to increased suspended particles."},
      {id:"S-DR-STREAM-5",category:"EAM",backgroundKnowledge:true,stem:"Which explanation is most consistent with turbidity remaining above the dry-weather value after the heaviest rain ended?",choices:["Suspended sediment can remain in the water or continue entering the stream after rainfall decreases.","Rainfall instantly removes all particles from streams.","Turbidity can only change while rain is physically falling at the station.","A stream cannot transport sediment downstream."],correct:"A",rationale:"Sediment introduced by runoff can remain suspended or continue moving into the channel after the peak rainfall event."}
    ]
  }
]);
