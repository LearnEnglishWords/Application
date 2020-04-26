export const defaultSettingsData = {
  "enableDarkMode": false,
  "wordsLimit": 30,
  "pronunciation": "uk",
  "enableAutoPlaySound": true,
  "swiperTransitionSpeed": 0
};            

export const trainingModes = [
  { value: "read", checked: true },
  { value: "write", checked: false },
  { value: "listen", checked: false }
]; 

export function getDefaultStatisticsData(count = 0) {
  return {
    "count": count,
    "known": 0,
    "learning": 0,
    "unknown": count
  }
}            

export function getDefaultModeStatisticsData(count = 0) {
  return {
    "read": { "known": 0, "unknown": count },
    "write": { "known": 0, "unknown": count },
    "listen": { "known": 0, "unknown": count },
  }
}            

export function isKnownForMode(word, mode) { 
  if (word.learning === undefined || Object.keys(word.learning).length === 0) { return false }
  if (word.learning[mode] === false) { return false } else { return true }
}

export function isKnown(word) {
  if (word.learning === undefined || Object.keys(word.learning).length === 0) { return false }
  if (word.learning.read !== false && word.learning.write !== false && word.learning.listen !== false) {
    return true
  } else {
    return false
  }
}                   

export function getState(word) {
  if (word.learning === undefined || Object.keys(word.learning).length === 0 || (word.learning.read === false && word.learning.write === false && word.learning.listen === false)) {
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

export const Collections = {
  BASIC: { id: 2, name: 'basic' },
  INTERMEDIATE: { id: 7, name: 'standard' },
  ADVANCED: { id: 3, name: 'advanced' },
  CATEGORY: { id: 9, name: 'category' },
  PERSONAL: { id: 'personal', name: 'personal' }
}

export const coreCollections = [
  Collections.BASIC.id,
  Collections.INTERMEDIATE.id,
  Collections.ADVANCED.id
]
