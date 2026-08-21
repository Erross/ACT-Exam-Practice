export const NUMBER_QUANTITY_QUESTIONS = Object.freeze([
  {
    "id": "M-NQ-FRACTIONS-1",
    "section": "math",
    "variantGroup": "nq-fractions",
    "category": "NQ",
    "modeling": false,
    "stem": "What is 3/4 + 5/6?",
    "choices": ["19/12","8/10","13/12","5/24"],
    "correct": "A",
    "rationale": "Use denominator 12: 9/12 + 10/12 = 19/12.",
    "difficulty": "medium"
  },
  {
    "id": "M-NQ-FRACTIONS-2","section":"math","variantGroup":"nq-fractions","category":"NQ","modeling":false,"stem":"What is 7/8 - 1/3?","choices":["6/5","13/24","4/11","17/24"],"correct":"B","rationale":"Use denominator 24: 21/24 - 8/24 = 13/24.","difficulty":"medium"
  },
  {"id":"M-NQ-EXPONENTS-1","section":"math","variantGroup":"nq-exponents","category":"NQ","modeling":false,"stem":"For x ≠ 0, which expression is equivalent to x^7 / x^3?","choices":["x^10","x^(7/3)","x^4","4x"],"correct":"C","rationale":"For equal bases, subtract exponents: x^(7-3)=x^4.","difficulty":"medium"},
  {"id":"M-NQ-EXPONENTS-2","section":"math","variantGroup":"nq-exponents","category":"NQ","modeling":false,"stem":"For y ≠ 0, which expression is equivalent to y^-2 / y^-5?","choices":["y^-7","3y","1/y^3","y^3"],"correct":"D","rationale":"Subtract exponents: -2-(-5)=3, so y^3.","difficulty":"medium"},
  {"id":"M-NQ-RADICALS-1","section":"math","variantGroup":"nq-radicals","category":"NQ","modeling":false,"stem":"Which expression is equivalent to sqrt(72)?","choices":["6sqrt(2)","8sqrt(1)","12sqrt(2)","3sqrt(8)"],"correct":"A","rationale":"72=36×2, so sqrt(72)=6sqrt(2).","difficulty":"medium"},
  {"id":"M-NQ-RADICALS-2","section":"math","variantGroup":"nq-radicals","category":"NQ","modeling":false,"stem":"Which expression is equivalent to sqrt(98)?","choices":["49sqrt(2)","7sqrt(2)","14sqrt(7)","2sqrt(49)"],"correct":"B","rationale":"98=49×2, so sqrt(98)=7sqrt(2).","difficulty":"medium"},
  {"id":"M-NQ-COMPLEX-1","section":"math","variantGroup":"nq-complex","category":"NQ","modeling":false,"stem":"If i^2 = -1, what is (3 + 2i) + (5 - 7i)?","choices":["2-5i","8+9i","8-5i","15-14i"],"correct":"C","rationale":"Combine real and imaginary parts separately: 3+5=8 and 2i-7i=-5i.","difficulty":"medium"},
  {"id":"M-NQ-COMPLEX-2","section":"math","variantGroup":"nq-complex","category":"NQ","modeling":false,"stem":"If i^2 = -1, what is (6 - 4i) - (1 + 3i)?","choices":["5-i","5+7i","7-7i","5-7i"],"correct":"D","rationale":"Subtract each part: 6-1=5 and -4i-3i=-7i.","difficulty":"medium"},
  {"id":"M-NQ-SCIENTIFIC-1","section":"math","variantGroup":"nq-scientific","category":"NQ","modeling":true,"stem":"A sample has mass 3.2×10^-4 gram. What is the mass of 25 such samples?","choices":["8.0×10^-3","8.0×10^-5","1.28×10^-5","80×10^-4"],"correct":"A","rationale":"25(3.2×10^-4)=80×10^-4=8.0×10^-3 gram.","difficulty":"medium"},
  {"id":"M-NQ-SCIENTIFIC-2","section":"math","variantGroup":"nq-scientific","category":"NQ","modeling":true,"stem":"A sensor records 4.5×10^6 particles per minute. How many particles are recorded in 20 minutes?","choices":["9.0×10^6","9.0×10^7","9.0×10^8","2.25×10^5"],"correct":"B","rationale":"20(4.5×10^6)=90×10^6=9.0×10^7.","difficulty":"medium"},
  {"id":"M-NQ-PERCENT-1","section":"math","variantGroup":"nq-percent","category":"NQ","modeling":true,"stem":"A jacket priced at $80 is discounted by 15%. What is the sale price?","choices":["$12","$65","$68","$92"],"correct":"C","rationale":"The discount is 0.15(80)=12, so the price is 80-12=$68.","difficulty":"medium"},
  {"id":"M-NQ-PERCENT-2","section":"math","variantGroup":"nq-percent","category":"NQ","modeling":true,"stem":"A $250 account balance increases by 8%. What is the new balance?","choices":["$258","$200","$230","$270"],"correct":"D","rationale":"An 8% increase is 0.08(250)=20, giving $270.","difficulty":"medium"},
  {"id":"M-NQ-RATIO-1","section":"math","variantGroup":"nq-ratio","category":"NQ","modeling":true,"stem":"The ratio of red beads to blue beads is 3:5. If there are 24 red beads, how many blue beads are there?","choices":["40","32","15","45"],"correct":"A","rationale":"24 is 8 times 3, so blue beads are 8×5=40.","difficulty":"medium"},
  {"id":"M-NQ-RATIO-2","section":"math","variantGroup":"nq-ratio","category":"NQ","modeling":true,"stem":"A map scale is 2 cm to 15 km. A road measures 7 cm on the map. What is its actual length?","choices":["22.5 km","52.5 km","35 km","105 km"],"correct":"B","rationale":"7/2=3.5 scale units, and 3.5×15=52.5 km.","difficulty":"medium"},
  {"id":"M-NQ-ABSOLUTE-1","section":"math","variantGroup":"nq-absolute","category":"NQ","modeling":false,"stem":"What is the value of |−7| + |3−8|?","choices":["2","7","12","10"],"correct":"C","rationale":"|−7|=7 and |−5|=5; their sum is 12.","difficulty":"medium"},
  {"id":"M-NQ-ABSOLUTE-2","section":"math","variantGroup":"nq-absolute","category":"NQ","modeling":false,"stem":"What is the value of |4−11| − |−2|?","choices":["−5","7","9","5"],"correct":"D","rationale":"|−7|=7 and |−2|=2; 7−2=5.","difficulty":"medium"},
  {"id":"M-NQ-SEQUENCES-1","section":"math","variantGroup":"nq-sequences","category":"NQ","modeling":false,"stem":"The first term of an arithmetic sequence is 7 and the common difference is 4. What is the 10th term?","choices":["43","39","47","70"],"correct":"A","rationale":"a10=7+9(4)=43. This calculation gives the stated answer.","difficulty":"medium"},
  {"id":"M-NQ-SEQUENCES-2","section":"math","variantGroup":"nq-sequences","category":"NQ","modeling":false,"stem":"The first term of a geometric sequence is 3 and the common ratio is 2. What is the 6th term?","choices":["48","96","192","36"],"correct":"B","rationale":"a6=3(2^5)=96. This calculation gives the stated answer.","difficulty":"medium"},
  {"id":"M-NQ-REMAINDER-1","section":"math","variantGroup":"nq-remainder","category":"NQ","modeling":false,"stem":"When 157 is divided by 12, what is the remainder?","choices":["11","5","1","13"],"correct":"C","rationale":"12×13=156, leaving remainder 1.","difficulty":"medium"},
  {"id":"M-NQ-REMAINDER-2","section":"math","variantGroup":"nq-remainder","category":"NQ","modeling":false,"stem":"When 263 is divided by 17, what is the remainder?","choices":["3","16","15","8"],"correct":"D","rationale":"17×15=255, leaving remainder 8.","difficulty":"medium"}
]);
