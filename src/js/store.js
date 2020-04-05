import { writable, get } from 'svelte/store';
import Collection from './collection.js';
import { 
  isKnownForMode, getState,
  defaultSettingsData, 
  defaultStatisticsData,
  defaultTrainingModeStatisticsData 
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

function createTrainingModeStatisticsData(startStatisticsData) {
  const { subscribe, set, update } = writable({...startStatisticsData});
  return {
    subscribe,
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
export const trainingModeStatisticsData = createTrainingModeStatisticsData({...defaultTrainingModeStatisticsData});
export const statisticsData = createStatisticsData({...defaultStatisticsData});


export async function updateAllStatistics(word, prevState) {
  get(collectionData).categoriesWithWords.forEach(({category, words}) => {
    if (words !== null && words.includes(word.text)) {
      let stats = createStatisticsData(category.stats);
      stats.updateData(word, prevState);
      category.stats = get(stats);
      collection.saveCategoryStatistics(get(collectionData).id, category.id, get(stats));
    }
  });
}
