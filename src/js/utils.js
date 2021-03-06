import md5 from 'md5';
import axios from 'axios';
import { get } from 'svelte/store';
import { settingsData } from './store.js';
import { backendUrl, backendApiUrl, isProduction } from './config.js';

export const defaultSettingsData = {
  "enableDarkMode": false,
  "wordsLimit": 20,
  "pronunciation": "uk",
  "translator": "google",
  "enableAutoPlaySound": true,
  "swiperTransitionSpeed": 0,
  "enableTrainingModeWall": true,
  "enableQuiz": true,
  "enableAdvancedWords": false,
  "backendApiUrl": backendApiUrl,
  "fastSelectingWords": true
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
  if(isProduction && uuid !== null) {
    axios.post(`${get(settingsData).backendApiUrl}/activity/`, {
      uuid: uuid
    });
  }
}

export function log(uuid, message) {
  axios.post(`${get(settingsData).backendApiUrl}/log/`, {
    uuid: uuid,
    message: message
  });
}

export function translate(text, engine="google") {
  return new Promise((resolve) => {
    axios.post(`${get(settingsData).backendApiUrl}/translate`, `text=${text}&engine=${engine}`)
      .then(function (response) {
        resolve(response.data.result)
      }).catch(function (error) {
        resolve(`ERROR: ${error}`)
      });
  });
}

export function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function deduplicate(array) {
  return array.filter((item, index) => array.indexOf(item) === index)
}

export function round(num, decimalPlaces) {
    var p = Math.pow(10, decimalPlaces);
    var e = Number.EPSILON * num * p;
    return Math.round((num * p) + e) / p;
}

export function openDialog(f7, text) {
  let dialog = f7.dialog.create({
    text: text, 
    buttons: [{ text: "Ok", bold: true }]
  });
  dialog.open();
}

export function setupLearning(word, state) { 
  if (word.learning === undefined) {
    word.learning = {"read": state, "write": state, "listen": state};
  }
}

export function setupRepetition(word, state) { 
  if (word.repetition === undefined) {
    word.repetition = {"read": state, "write": state, "listen": state};
  }
}

export const WordsType = {
    ALL: 'all',
    ALL_KNOWN: 'all_known',
    ALREADY_KNOWN: 'already_known',
    KNOWN: 'known',
    LEARNING: 'learning',
    UNKNOWN: 'unknown'
}

export const Modes = {
    ALL: 'all',
    READ: 'read',
    WRITE: 'write',
    LISTEN: 'listen'
}

export const KnownStages = {
    UNKNOWN: 0,
    LITTLE_KNOWN: 2,
    KNOWN: 4,
    MEDIUM_KNOWN: 8,
    HARD_KNOWN: 12,
    ALREADY_KNOWN: 25
}

export const LearningMode = {
    TRAINING: "training",
    EXAM: "exam",
    REPETITION: "repetition",
    FILTER: "filter",
    SEARCH: "search"
}

export const AppInfo = {
  DOWNLOADED_COLLECTIONS: "downloadedCollections",
  LAST_ACTIVITY: "lastActivity",
  LAST_UPDATE: "lastUpdate",
  NUMBER_PERSONAL_CATEGORIES: "numberPersonalCategories"
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
