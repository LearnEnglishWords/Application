import { writable } from 'svelte/store';
import { 
  defaultSettingsData, 
  //getDefaultStatisticsData,
  //getDefaultModeStatisticsData,
  //WordsType
} from './utils.js'
//import DS from './storages/data.js';

//function createStatisticsData(startStatisticsData) {
//  const { subscribe, set, update } = writable({...startStatisticsData});
//  return {
//    subscribe, set,
//    updateData: () => update((data) => { return data }),
//    reset: () => {
//      set({...startStatisticsData});
//    }
//  };
//}

//function createModeStatisticsData(startStatisticsData) {
//  const { subscribe, set, update } = writable({...startStatisticsData});
//  return {
//    subscribe, set,
//    updateData: () => update((data) => { return data }),
//    reset: () => {
//      set({...startStatisticsData});
//    }
//  };
//}

//function createAllLearningWordsData(type, startData) {
//  const { subscribe, set, update } = writable({...startData});
//  return {
//    subscribe, set,
//    updateData: (mode, addWords, removeWords) => update((data) => { 
//      let words = data;
//      words[mode] = words[mode]
//        .concat(addWords)
//        .filter(wordId => !removeWords.includes(wordId));
//      words[mode] = [...new Set(words[mode])];
//      DS.saveAllLearningWords(type, mode, words[mode]);
//      return words 
//    })
//  };
//}


export const trainingData = writable(0);
export const allCollectionsData = writable([]);
export const collectionData = writable(0);
export const categoryGroupData = writable(null);
export const downloadedCollections = writable([]);
export const categoryDetailData = writable(0);
export const settingsData = writable({...defaultSettingsData});
export const modeStatisticsData = writable(null);
export const statisticsData = writable(null);
export const deviceUUID = writable(null);
//export const allKnownWordsData = createAllLearningWordsData(WordsType.KNOWN, {"read": [], "write": [], "listen": []});
//export const allNotKnownWordsData = createAllLearningWordsData(WordsType.NOT_KNOWN, {"read": [], "write": [], "listen": []});
