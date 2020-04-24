import { writable, get } from 'svelte/store';
import DS from './storages/data.js';
import { 
  isKnown,
  defaultSettingsData, 
  defaultStatisticsData,
  defaultModeStatisticsData 
} from './utils.js'

function createStatisticsData(startStatisticsData) {
  const { subscribe, set, update } = writable({...startStatisticsData});
  return {
    subscribe, set,
    setCount: (count) => update((data) => { 
      data.count = count;
      data.known = 0;
      data.learning = 0;
      data.unknown = count;
      return data
    }),
    updateData: () => update((data) => { return data }),
    reset: () => {
      set({...startStatisticsData});
    }
  };
}

function createModeStatisticsData(startStatisticsData) {
  const { subscribe, set, update } = writable({...startStatisticsData});
  return {
    subscribe, set,
    setCount: (count, prevLearningState = {"read": false, "write": false, "listen": false}) => update((data) => { 
      for (let [mode, prevState] of Object.entries(prevLearningState)) {
        data[mode].known = 0;
        data[mode].unknown = count;
      }
      return data
    }),
    updateData: () => update((data) => { return data }),
    reset: () => {
      set({...startStatisticsData});
    }
  };
}


export const trainingData = writable(0);
export const allCollectionsData = writable([]);
export const collectionData = writable(0);
export const categoryGroupData = writable(null);
export const downloadedCollections = writable([]);
export const categoryDetailData = writable(0);
export const settingsData = writable({...defaultSettingsData});
export const trainingModeStatisticsData = createModeStatisticsData({...defaultModeStatisticsData});
export const statisticsData = createStatisticsData({...defaultStatisticsData});



//function removeWordFromCategory(currentCollection, category, word) {
//  DS.getWordIdsList(currentCollection.id, category.id, WordsType.NOT_KNOWN, Modes.ALL).then((wordIds) => {
//    const index = wordIds.indexOf(word.text);
//    if (index > -1) { wordIds.splice(index, 1) }
//    DS.saveWordIdsList(currentCollection.id, category.id, wordIds, WordsType.NOT_KNOWN, Modes.ALL);
//  });                                       
//}
//
//function addWordIntoCategory(currentCollection, category, word) {
//  DS.getWordIdsList(currentCollection.id, category.id, WordsType.NOT_KNOWN, Modes.ALL).then((wordIds) => {
//    wordIds.push(word.text);
//    DS.saveWordIdsList(currentCollection.id, category.id, wordIds, WordsType.NOT_KNOWN, Modes.ALL);
//  });                                       
//}

//async function updateStatistics(category, word, prevState, modes) {
//  let currentCollection = get(collectionData);
//
//  let stats = createStatisticsData(category.stats);
//  let modeStats = createModeStatisticsData(category.modeStats);
//
//  stats.updateData(word, prevState);
//  modeStats.updateData(word, modes);
//
//  category.stats = get(stats);
//  category.modeStats = get(modeStats);
//
//  DS.saveCategoryStatistics(currentCollection.id, category.id, get(stats));
//  DS.saveCategoryModeStatistics(currentCollection.id, category.id, get(modeStats));
//}

//function updateInOtherCategories(word, prevState, modes) {
//  get(collectionData).categoriesWithWords.forEach(({category, wordIds}) => {
//    if (wordIds !== null && category.id !== get(categoryDetailData).id && wordIds.includes(word.text)) {
//      updateStatistics(category, word, prevState, modes);
//      if (getState(word) === WordsType.KNOWN) {
//        removeWordFromCategory(get(collectionData), category, word);
//      } else {
//        addWordIntoCategory(get(collectionData), category, word);
//      }
//    }
//  });
//}

function addKnownCategory(word) {
  if (word.knownCategories === undefined) {
    word.knownCategories = [];
  }
  word.knownCategories.push(get(categoryDetailData).id);
}

function removeKnownCategory(word) {
  if (word.knownCategories !== undefined) {
    let index = word.knownCategories.indexOf(get(categoryDetailData).id);
    if (index > -1) { word.knownCategories.splice(index, 1) }
  }
}

function updateStatistics(collectionId, word, prevState, modes) {
  let advancedCollection = get(allCollectionsData).find((c) => c.id === collectionId);
  advancedCollection ? advancedCollection.updateStatistics(word, prevState, modes) : null
}

function updateMainCollectionWordStatistics(word, prevState, modes) {
  if (![2,7,3].includes(word.collectionId)) { return }
  updateStatistics(3, word, prevState, modes);

  if (word.collectionId === 2) {
    updateStatistics(2, word, prevState, modes);
    updateStatistics(7, word, prevState, modes);
  } 
  else if (word.collectionId === 7) {
    updateStatistics(7, word, prevState, modes);
  }
}

export async function updateAllStatisticsAndSaveWord(word, prevState, modes) {
  let currentCategory = get(categoryDetailData);

  currentCategory.updateStatistics(word, prevState, modes);

  if (isKnown(word)) {
    addKnownCategory(word);
  } else {
    removeKnownCategory(word);
  }

  return DS.saveWord(word.text, word);
}
