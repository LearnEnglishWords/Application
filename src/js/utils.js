export const defaultSettingsData = {
  "enableDarkMode": false,
  "wordsLimit": 30,
  "pronunciation": "uk",
  "enableAutoPlaySound": true,
  "swiperTransitionSpeed": 0
};            

export const defaultStatisticsData = {
  "count": 100,
  "known": 0,
  "learning": 0,
  "unknown": 100
};            

export const defaultModeStatisticsData = {
  "read": { "known": 0, "unknown": 100 },
  "write": { "known": 0, "unknown": 100 },
  "listen": { "known": 0, "unknown": 100 },
}


export const defaultTrainingModes = [
  { value: "read", checked: true, icon: "local_library" },
  { value: "write", checked: false, icon: "edit" },
  { value: "listen", checked: false, icon: "spellcheck" }
]; 

export function getDefaultStatisticsData(count) {
  return {
    "count": count,
    "known": 0,
    "learning": 0,
    "unknown": count
  }
};            

export function getDefaultModeStatisticsData(count) {
  return {
    "read": { "known": 0, "unknown": count },
    "write": { "known": 0, "unknown": count },
    "listen": { "known": 0, "unknown": count },
  }
};            

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

export function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export const WordsType = {
    ALL: 'all',
    KNOWN: 'known',
    LEARNING: 'learning',
    UNKNOWN: 'unknown',
    NOT_KNOWN: 'not_known'
}

export const Modes = {
    ALL: 'all',
    READ: 'read',
    WRITE: 'write',
    LISTEN: 'listen'
}

export const AppInfo = {
  DOWNLOADED_COLLECTIONS: "downloadedCollections"
}

