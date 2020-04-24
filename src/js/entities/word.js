import { get } from 'svelte/store';
import DS from '../storages/data.js';
import { isKnown } from '../utils.js'
import { categoryDetailData, categoryGroupData } from '../store.js';


function addKnownCategory(word) {
  if (word.knownCategories === undefined) {
    word.knownCategories = [];
  }
  let currentCategory = get(categoryDetailData);
  if (currentCategory.id !== null) {
    word.knownCategories.push(currentCategory.id);
  }
}

function removeKnownCategory(word) {
  let currentCategory = get(categoryDetailData);
  if (word.knownCategories !== undefined && currentCategory.id !== null) {
    let index = word.knownCategories.indexOf(currentCategory.id);
    if (index > -1) { word.knownCategories.splice(index, 1) }
  }
}


export default class Word {
  //constructor(text, pronunciation, state, sense, examples) {
  //  this.text = name;
  //  this.pronunciation = pronunciation;
  //  this.state = state;
  //  this.sense = sense;
  //  this.examples = examples;
  //}

  static setNewState(word, learningState) {
    let prevLearningState = word.learning;
    word.learning = learningState;

    var currentCategory = get(categoryGroupData)
    if (currentCategory === null) { 
      currentCategory = get(categoryDetailData);
    }
    currentCategory.updateStatistics(word, prevLearningState);

    if (isKnown(word)) {
      addKnownCategory(word);
    } else {
      removeKnownCategory(word);
    }

    return DS.saveWord(word.text, word);
  }
}
