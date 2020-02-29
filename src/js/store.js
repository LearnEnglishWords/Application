import { writable, get } from 'svelte/store';
import Collection from './collection.js';


function createStatisticsData(startStatisticsData) {
  const { subscribe, set, update } = writable({...startStatisticsData});
  return {
    subscribe,
    setCount: (count) => update((data) => { 
      data.count = count;
      data.unknown = count;
      return data
    }),
    updateData: (word) => update((data) => {
      if (word.learning === undefined) { return data }
      if (word.learning.read !== false && word.learning.write !== false && word.learning.listen !== false) {
        data.known += 1;
        data.unknown -= 1;
      } else {
        data.learning += 1;
        data.unknown -= 1;
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
export const settingsData = writable(0);
export const statisticsData = createStatisticsData({
  "count": 100,
  "known": 0,
  "learning": 0,
  "unknown": 100
});


