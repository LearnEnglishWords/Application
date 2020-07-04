import md5 from 'md5';
import axios from 'axios';
import { backendUrl, backendApiUrl} from './config.js';

export const defaultSettingsData = {
  "enableDarkMode": false,
  "wordsLimit": 30,
  "pronunciation": "uk",
  "enableAutoPlaySound": true,
  "swiperTransitionSpeed": 0,
  "enableTrainingModeWall": false,
  "defaultWordListFilter": "all"
};            

export const trainingModes = [
  { value: "read", checked: true, icon: "book-open-2" },
  { value: "write", checked: false, icon: "d-edit" },
  { value: "listen", checked: false, icon: "volume" }
]; 

export function getDefaultModeStatisticsData(count = 0) {
  return {
    "read": { "known": 0, "unknown": count },
    "write": { "known": 0, "unknown": count },
    "listen": { "known": 0, "unknown": count },
  }
}            

export function isKnown(word) {
  if (word.learning === undefined || Object.keys(word.learning).length === 0) { return false }
  if (word.learning.read !== false && word.learning.write !== false && word.learning.listen !== false) {
    return true
  } else {
    return false
  }
}                   

export function isAlreadyKnown(word) {
  if (word.repetition === undefined || Object.keys(word.repetition).length === 0) { return false }
  if (word.repetition.read !== false && word.repetition.write !== false && word.repetition.listen !== false) {
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
  audio.src = `${backendUrl}/sounds/words/${text}-${pronunciation}.mp3`;
  audio.play();
}

export function playExampleSound(example, pronunciation) {
  let hash = getHash(example, getLangCode(pronunciation));
  var audio = new Audio();
  audio.src = `${backendUrl}/sounds/examples/${hash}.mp3`;
  audio.play();
}

export function setActivity(uuid) {
  axios.post(`${backendApiUrl}/activity/`, {
    uuid: uuid
  });
}

export function log(uuid, message) {
  axios.post(`${backendApiUrl}/log/`, {
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
    ALREADY_KNOWN: 'already_known',
    KNOWN: 'known',
    LEARNING: 'learning',
    UNKNOWN: 'unknown'
}

export const Modes = {
    ALL: 'all',
    //KNOWN: 'known',
    READ: 'read',
    WRITE: 'write',
    LISTEN: 'listen'
}

export const KnownStages = {
    UNKNOWN: 0,
    NOT_KNOWN: 0,
    KNOWN: 4,
    MEDIUM_KNOWN: 8,
    HARD_KNOWN: 12,
    ALREADY_KNOWN: 25
}

export const WordListFilter = {
    ALL: "all",
    KNOWN: "known",
    UNKNOWN: "unknown"
}

export const LearningMode = {
    TRAINING: "training",
    EXAM: "exam",
    REPETITION: "repetition",
    FILTER: "filter"
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
