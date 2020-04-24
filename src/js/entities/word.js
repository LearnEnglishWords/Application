import { get } from 'svelte/store';
import DS from '../storages/data.js';
import { isKnown } from '../utils.js'
import { categoryDetailData, categoryGroupData } from '../store.js';


function addKnownCategory(word) {
  if (word.knownCategories === undefined) {
    word.knownCategories = [];
  }
  let categoryGroup = get(categoryGroupData);
  if (categoryGroup !== null) {
    categoryGroup.categories.forEach((category) => {
      word.knownCategories.push(category.id);
    });
  } else {
    word.knownCategories.push(get(categoryDetailData).id);
  }
}

function removeKnownCategory(word) {
  if (word.knownCategories === undefined) { return }
  let categoryGroup = get(categoryGroupData);

  if (categoryGroup !== null) {
    categoryGroup.categories.forEach((category) => {
      let index = word.knownCategories.indexOf(category.id);
      if (index > -1) { word.knownCategories.splice(index, 1) }
    });
  } else {
    let index = word.knownCategories.indexOf(get(categoryDetailData).id);
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
