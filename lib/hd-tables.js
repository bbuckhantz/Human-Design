export const CHANNELS = [
  ["1","8"],["2","14"],["3","60"],["4","63"],["5","15"],["6","59"],["7","31"],
  ["9","52"],["10","20"],["10","34"],["11","56"],["12","22"],["13","33"],["16","48"],
  ["17","62"],["18","58"],["19","49"],["20","57"],["20","34"],["21","45"],["23","43"],
  ["24","61"],["25","51"],["26","44"],["27","50"],["28","38"],["29","46"],["30","41"],
  ["32","54"],["34","57"],["34","20"],["35","36"],["37","40"],["39","55"],["41","30"],
  ["42","53"]
];

export const CENTER_BY_GATE = {
  "61":"Head","63":"Head","64":"Head",
  "47":"Ajna","24":"Ajna","4":"Ajna","11":"Ajna","17":"Ajna","43":"Ajna",
  "62":"Throat","56":"Throat","35":"Throat","33":"Throat","31":"Throat","45":"Throat",
  "8":"Throat","16":"Throat","20":"Throat","12":"Throat","23":"Throat",
  "1":"G","2":"G","7":"G","10":"G","13":"G","15":"G","46":"G","25":"G",
  "21":"Heart","26":"Heart","40":"Heart","51":"Heart",
  "48":"Spleen","57":"Spleen","44":"Spleen","50":"Spleen","32":"Spleen","18":"Spleen",
  "6":"SolarPlexus","37":"SolarPlexus","22":"SolarPlexus","30":"SolarPlexus",
  "36":"SolarPlexus","49":"SolarPlexus","55":"SolarPlexus",
  "5":"Sacral","9":"Sacral","14":"Sacral","29":"Sacral","34":"Sacral","59":"Sacral",
  "27":"Sacral","42":"Sacral","3":"Sacral",
  "41":"Root","52":"Root","53":"Root","54":"Root","58":"Root","60":"Root","38":"Root","39":"Root"
};

export const ALL_CENTERS = ["Head","Ajna","Throat","G","Heart","Spleen","SolarPlexus","Sacral","Root"];

export function inferTypeAndAuthority(definedCenters, definedChannels) {
  const has = c => definedCenters.has(c);

  // Type
  let type;
  if (has("Sacral")) {
    const motors = ["Sacral","Root","Heart","SolarPlexus"];
    const motorToThroat = definedChannels.some(ch=>{
      const [a,b]=ch.split("-");
      const ca = CENTER_BY_GATE[a], cb = CENTER_BY_GATE[b];
      return (motors.includes(ca) || motors.includes(cb)) && (ca==="Throat" || cb==="Throat");
    });
    type = motorToThroat ? "Manifesting Generator" : "Generator";
  } else if (has("Throat")) {
    const motors = ["Root","Heart","SolarPlexus"];
    const motorToThroat = definedChannels.some(ch=>{
      const [a,b]=ch.split("-");
      const ca = CENTER_BY_GATE[a], cb = CENTER_BY_GATE[b];
      return (motors.includes(ca) || motors.includes(cb)) && (ca==="Throat" || cb==="Throat");
    });
    type = motorToThroat ? "Manifestor" : "Projector";
  } else {
    type = "Projector";
  }
  if ([...definedCenters].length === 0) type = "Reflector";

  // Authority (priority)
  let authority = "None";
  if (has("SolarPlexus")) authority = "Emotional";
  else if (has("Sacral") && type!=="Manifestor" && type!=="Projector") authority = "Sacral";
  else if (has("Spleen")) authority = "Splenic";
  else if (has("Heart")) authority = "Ego";
  else if (has("G")) authority = "Self-Projected";
  else if ([...definedCenters].length === 0) authority = "Lunar";

  return { type, authority };
}
