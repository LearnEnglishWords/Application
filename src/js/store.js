import { writable, get } from 'svelte/store';
import Collection from './collection.js';
import { 
  isKnownForMode, getState,
  defaultSettingsData, 
  defaultStatisticsData,
  defaultTreiningModeStatisticsData 
} from './utils.js'


function createStatisticsData(startStatisticsData) {
  const { subscribe, set, update } = writable({...startStatisticsData});
  return {
    subscribe,
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
export const categoryData = writable(0);
export const categoryDetailData = writable(0);
export const settingsData = writable({...defaultSettingsData});
export const trainingModeStatisticsData = createTrainingModeStatisticsData({...defaultTreiningModeStatisticsData});
export const statisticsData = createStatisticsData({...defaultStatisticsData});


