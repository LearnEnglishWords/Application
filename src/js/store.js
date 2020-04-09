import { writable, get } from 'svelte/store';
import Collection from './collection.js';
import { 
  WordsType, Modes,
  isKnownForMode, getState,
  defaultSettingsData, 
  defaultStatisticsData,
  defaultModeStatisticsData 
} from './utils.js'

let collection = new Collection();

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
    updateData: (word, prevState) => update((data) => {
      let currentState = getState(word);
      if (word.learning === undefined || currentState === prevState) { return data }
      data[currentState] += 1;
      data[prevState] -= 1;
      return data
    }),
    reset: () => {
      set({...startStatisticsData});
    }
  };
}

function createModeStatisticsData(startStatisticsData) {
  const { subscribe, set, update } = writable({...startStatisticsData});
  return {
    subscribe, set,
    setCount: (count, modes) => update((data) => { 
      for (let {mode, prevState} of modes) {
        data[mode].known = 0;
        data[mode].unknown = count;
      }
      return data
    }),
    updateData: (word, modes) => update((data) => {
      for (let {mode, prevState} of modes) {
        let currentState = isKnownForMode(word, mode);
        if(currentState === prevState) { continue }
        if(currentState) {
          data[mode].known += 1; 
          data[mode].unknown -= 1; 
        } else {
          data[mode].known -= 1; 
          data[mode].unknown += 1; 
        }
      }
      return data
    }),
    reset: () => {
      set({...startStatisticsData});
    }
  };
}


export const trainingData = writable(0);
export const allCollectionsData = writable([]);
export const collectionData = writable(0);
export const categoriesData = writable([]);
export const downloadedCollections = writable([]);
export const categoryDetailData = writable(0);
export const settingsData = writable({...defaultSettingsData});
export const trainingModeStatisticsData = createModeStatisticsData({...defaultModeStatisticsData});
export const statisticsData = createStatisticsData({...defaultStatisticsData});



function removeWordFromCategory(currentCollection, category, word) {
  collection.getWordIdsList(currentCollection.id, category.id, WordsType.NOT_KNOWN, Modes.ALL, (wordIds) => {
    const index = wordIds.indexOf(word.text);
    if (index > -1) { wordIds.splice(index, 1) }
    collection.saveWordIdsList(currentCollection.id, category.id, wordIds, WordsType.NOT_KNOWN, Modes.ALL);
  });                                       
}

function addWordIntoCategory(currentCollection, category, word) {
  collection.getWordIdsList(currentCollection.id, category.id, WordsType.NOT_KNOWN, Modes.ALL, (wordIds) => {
    wordIds.push(word.text);
    collection.saveWordIdsList(currentCollection.id, category.id, wordIds, WordsType.NOT_KNOWN, Modes.ALL);
  });                                       
}

async function updateStatistics(category, word, prevState, modes) {
  let currentCollection = get(collectionData);

  let stats = createStatisticsData(category.stats);
  let modeStats = createModeStatisticsData(category.modeStats);

  stats.updateData(word, prevState);
  modeStats.updateData(word, modes);

  category.stats = get(stats);
  category.modeStats = get(modeStats);

  collection.saveCategoryStatistics(currentCollection.id, category.id, get(stats));
  collection.saveCategoryModeStatistics(currentCollection.id, category.id, get(modeStats));
}

function updateInOtherCategories(word, prevState, modes) {
  get(collectionData).categoriesWithWords.forEach(({category, wordIds}) => {
    if (wordIds !== null && category.id !== get(categoryDetailData).id && wordIds.includes(word.text)) {
      updateStatistics(category, word, prevState, modes);
      if (getState(word) === WordsType.KNOWN) {
        removeWordFromCategory(get(collectionData), category, word);
      } else {
        addWordIntoCategory(get(collectionData), category, word);
      }
    }
  });
}

export async function updateAllStatisticsAndSaveWord(word, prevState, modes) {
  let currentCategory = get(categoryDetailData);
  let currentCollection = get(collectionData);

  // Update statistics
  statisticsData.updateData(word, prevState);
  trainingModeStatisticsData.updateData(word, modes);

  //updateInOtherCategories(word, prevState, modes);

  // Save current statistics
  collection.saveCategoryStatistics(currentCollection.id, currentCategory.id, get(statisticsData));
  collection.saveCategoryModeStatistics(currentCollection.id, currentCategory.id, get(trainingModeStatisticsData));

  collection.saveWord(word.text, word);
}
