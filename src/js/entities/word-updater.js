import { get } from 'svelte/store';
import DS from '../storages/data.js';
import { categoryDetailData, categoryGroupData } from '../store.js';


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

    return DS.saveWord(word.text, word);
  }
}
