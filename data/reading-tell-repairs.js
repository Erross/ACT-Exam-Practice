export const READING_TELL_REPAIRS = Object.freeze({
  "R-LIT-BACKDROP-1": {
    B:"Theater scenery is generally worth reusing in new productions when the surviving paint remains visible from the audience.",
    C:"Community renovation projects are most successful when their budgets are large enough to restore most historical objects they uncover.",
  },
  "R-INFO-DAYLIGHT-2": {
    C:"It can keep downstream water levels nearly unchanged during large storms by slowing runoff throughout the restored corridor.",
    D:"It can replace much of the surrounding drainage network once an open channel and floodable area are constructed.",
  },
  "R-INFO-DAYLIGHT-3": {
    B:"Historical streams generally formed disconnected channels that planners now try to link during restoration.",
    D:"Vegetation establishes most successfully beside newly constructed roads because those corridors provide the necessary soil conditions.",
  },
  "R-INFO-DAYLIGHT-4": {
    B:"Sunlight tends to reduce aquatic habitat quality in restored streams by warming the water beyond useful ecological conditions.",
    D:"Aquatic habitat is primarily created by underground pipes, so exposing a stream usually reduces the available habitat.",
  },
  "R-VQI-BIKESHARE-3": {
    C:"Forecasts become useful mainly after a station has experienced a shortage, when operators can model the recovery period.",
    D:"Frequent model updates can substitute for most observation of actual trips because changing weather and transit conditions are incorporated into the forecast.",
  },
  "R-VQI-BIKESHARE-5": {
    B:"Rider incentives generally cost more than truck operations because payments to riders usually exceed the operating cost of moving bicycles.",
    C:"Operators should avoid changing incentive values in response to demand because changing prices makes rider behavior harder to predict.",
  },
});

export function applyReadingTellRepairs(passages){
  return passages.map(passage=>({
    ...passage,
    questions:passage.questions.map(question=>{
      const repairs=READING_TELL_REPAIRS[question.id];
      if(!repairs) return question;
      const choices=[...question.choices];
      for(const [letter,text] of Object.entries(repairs)){
        const index="ABCD".indexOf(letter);
        if(index<0 || letter===question.correct) throw new Error(`Invalid Reading tell repair for ${question.id} ${letter}`);
        choices[index]=text;
      }
      return {...question,choices};
    }),
  }));
}
