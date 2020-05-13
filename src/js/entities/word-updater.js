import { get } from 'svelte/store';
import DS from '../storages/data.js';
import { isKnown } from '../utils.js'
import { categoryDetailData, categoryGroupData } from '../store.js';


function addKnownCategories(word, categories) {
  if (word.knownCategories === undefined) {
    word.knownCategories = [];
  }
  categories.forEach((category) => {
    word.knownCategories.push(category.id);
  });
}

function removeKnownCategories(word, categories) {
  if (word.knownCategories === undefined) { return }

  categories.forEach((category) => {
    let index = word.knownCategories.indexOf(category.id);
    if (index > -1) { word.knownCategories.splice(index, 1) }
  });
}

function setKnownCategories(word, categoryGroup) {
  if (isKnown(word)) {
    addKnownCategories(word, categoryGroup);
  } else {
    removeKnownCategories(word, categoryGroup);
  }
}

function getCurrentCategory() {
  var currentCategory = get(categoryGroupData)
  if (currentCategory === null) { 
    currentCategory = get(categoryDetailData);
  }
  return currentCategory
}

export default class WordUpdater {
  static update(word, prevLearningState) {
    var currentCategory = getCurrentCategory();
    currentCategory.updateStatistics(word, prevLearningState);

    let categoryGroup = get(categoryGroupData);
    if (categoryGroup !== null) {
      setKnownCategories(word, categoryGroup.categories);
    } else {
      setKnownCategories(word, [get(categoryDetailData)]);
    }

    return DS.saveWord(word.text, word);
  }
}
