import { get } from 'svelte/store';
import DS from '../storages/data.js';
import { isKnown, Collections, coreCollections } from '../utils.js'
import { allCollectionsData, categoryDetailData, categoryGroupData } from '../store.js';


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

function getOtherCollections(currentCategory) {
  if (coreCollections.includes(currentCategory.collectionId)) {
    return get(allCollectionsData).filter((collection) => 
      [Collections.CATEGORY.id].includes(collection.id)
    );
  } else {
    return get(allCollectionsData).filter((collection) => 
      coreCollections.includes(collection.id)
    );
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


  static updateOtherCategories(word, prevLearningState, mode, isKnown = true) {
    var currentCategory = getCurrentCategory();
    let collections = getOtherCollections(currentCategory);

    collections.forEach((collection) => {
      collection.categoryGroup.updateStatistics(word, prevLearningState, true);
      if (isKnown) {
        collection.categoryGroup.updateWords(mode, [], [word.text]);
      } else {
        collection.categoryGroup.updateWords(mode, [word.text], []);
      }
      setKnownCategories(word, collection.categoryGroup.categories);
    });
  }
}
