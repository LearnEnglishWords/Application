import md5 from 'md5';
import axios from 'axios';

export const defaultSettingsData = {
  "enableDarkMode": false,
  "wordsLimit": 30,
  "pronunciation": "uk",
  "enableAutoPlaySound": true,
  "swiperTransitionSpeed": 0
};            

export const trainingModes = [
  { value: "read", checked: true, icon: "book-open-2" },
  { value: "write", checked: false, icon: "d-edit" },
  { value: "listen", checked: false, icon: "volume" }
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

function getHash(text, pronunciation, speed = 'normal') {
  return md5(text + pronunciation + speed)
}

function getLangCode(pronunciation) {
  switch(pronunciation) {
  case 'uk':
    return 'en-GB'
  case 'us':
    return 'en-US'
  } 
}

export function playTextSound(text, pronunciation) {
  if (pronunciation === 'uk') { pronunciation = 'gb' }
  var audio = new Audio();
  audio.src = `https://learn-english-words.eu/sounds/words/${text}-${pronunciation}.mp3`;
  audio.play();
}

export function playExampleSound(example, pronunciation) {
  let hash = getHash(example, getLangCode(pronunciation));
  var audio = new Audio();
  audio.src = `https://learn-english-words.eu/sounds/examples/${hash}.mp3`;
  audio.play();
}

export function setActivity(uuid) {
  axios.post(`https://drakeman.cz/api/activity/`, {
    uuid: uuid
  });
}

export function log(uuid, message) {
  axios.post(`https://drakeman.cz/api/log/`, {
    uuid: uuid,
    message: message
  });
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
  DOWNLOADED_COLLECTIONS: "downloadedCollections",
  LAST_ACTIVITY: "lastActivity",
  LAST_UPDATE: "lastUpdate"
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
