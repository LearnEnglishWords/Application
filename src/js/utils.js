export const defaultSettingsData = {
  "enableDarkMode": false,
  "wordsLimit": 30,
  "pronunciation": "uk",
  "enableAutoPlaySound": true
};            

export const defaultStatisticsData = {
  "count": 100,
  "known": 0,
  "learning": 0,
  "unknown": 100
};            

export const defaultTrainingModeStatisticsData = {
  "read": {"known": 0, "unknown": 100},
  "write": {"known": 0, "unknown": 100},
  "listen": {"known": 0, "unknown": 100},
}

export const trainingModes = [
  {title: "Cteni", value: "read", checked: true},
  {title: "Psani", value: "write", checked: false},
  {title: "Poslech", value: "listen", checked: false}
]; 

export function isKnownForMode(word, mode) { 
  if (word.learning === undefined) { return false }
  if (word.learning[mode] === false) { return false } else { return true }
}

export function isKnown(word) {
  if (word.learning === undefined) { return false }
  if (word.learning.read !== false && word.learning.write !== false && word.learning.listen !== false) {
    return true
  } else {
    return false
  }
}                   

export function getState(word) {
  if (word.learning === undefined || (word.learning.read === false && word.learning.write === false && word.learning.listen === false)) {
    return "unknown"
  } else if (word.learning.read !== false && word.learning.write !== false && word.learning.listen !== false) {
    return "known"
  } else {
    return "learning"
  }
}

export function playSound(word) {
  var audio = new Audio();
  audio.src = `https://drakeman.cz/english-words/collections/basic/sounds/${word.text}.mp3`;
  audio.play();
}
