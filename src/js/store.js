import { writable } from 'svelte/store';
import { 
  defaultSettingsData, 
  getDefaultStatisticsData,
  getDefaultModeStatisticsData 
} from './utils.js'
import DS from './storages/data.js';

function createStatisticsData(startStatisticsData) {
  const { subscribe, set, update } = writable({...startStatisticsData});
  return {
    subscribe, set,
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
    updateData: () => update((data) => { return data }),
    reset: () => {
      set({...startStatisticsData});
    }
  };
}

function createAllKnownWordsData(startData) {
  const { subscribe, set, update } = writable({...startData});
  return {
    subscribe, set,
    updateData: (mode, addWords, removeWords) => update((data) => { 
      let knownWords = data;
      knownWords[mode] = knownWords[mode]
        .concat(addWords)
        .filter(wordId => !removeWords.includes(wordId));
      knownWords[mode] = [...new Set(knownWords[mode])];
      DS.saveAllKnownWords(mode, knownWords[mode]);
      return knownWords 
    })
  };
}


export const trainingData = writable(0);
export const allCollectionsData = writable([]);
export const collectionData = writable(0);
export const categoryGroupData = writable(null);
export const downloadedCollections = writable([]);
export const categoryDetailData = writable(0);
export const settingsData = writable({...defaultSettingsData});
export const trainingModeStatisticsData = createModeStatisticsData({...getDefaultModeStatisticsData(100)});
export const statisticsData = createStatisticsData({...getDefaultStatisticsData(100)});
export const deviceUUID = writable(null);
export const allKnownWordsData = createAllKnownWordsData({"read": [], "write": [], "listen": []});
