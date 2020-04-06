import { writable, get } from 'svelte/store';
import Collection from './collection.js';
import { 
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
export const collectionData = writable(0);
export const downloadedCollections = writable([]);
export const categoryDetailData = writable(0);
export const settingsData = writable({...defaultSettingsData});
export const trainingModeStatisticsData = createModeStatisticsData({...defaultModeStatisticsData});
export const statisticsData = createStatisticsData({...defaultStatisticsData});


export async function updateAllStatisticsAndSaveWord(word, prevState, modes) {
  let currentCategory = get(categoryDetailData)
  statisticsData.updateData(word, prevState);
  trainingModeStatisticsData.updateData(word, modes);

  get(collectionData).categoriesWithWords.forEach(({category, words}) => {
    if (words !== null && category.id !== currentCategory.id && words.includes(word.text)) {
      let stats = createStatisticsData(category.stats);
      let modeStats = createModeStatisticsData(category.modeStats);

      stats.updateData(word, prevState);
      modeStats.updateData(word, modes);

      category.stats = get(stats);
      category.modeStats = get(modeStats);

      collection.saveCategoryStatistics(get(collectionData).id, category.id, get(stats));
      collection.saveCategoryModeStatistics(get(collectionData).id, category.id, get(modeStats));
    }
  });

  collection.saveCategoryStatistics(get(collectionData).id, currentCategory.id, get(statisticsData));
  collection.saveCategoryModeStatistics(get(collectionData).id, currentCategory.id, get(trainingModeStatisticsData));

  collection.saveWord(word.text, word);
}
