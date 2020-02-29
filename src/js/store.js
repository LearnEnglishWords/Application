import { writable, get } from 'svelte/store';
import Collection from './collection.js';

function createTrainingData() {
  const { subscribe, set, update } = writable({ mode: 0, limit: 30 });

  return {
    subscribe,
    setMode: (mode) => update(data => {data.mode = mode; return data}),
    setLimit: (limit) => update(data => {data.limit = limit; return data}),
    reset: () => set({ mode: 0, limit: 30 })
  };
}

//export const trainingData = createTrainingData();
export const trainingData = writable(0);
export const collectionData = writable(0);
export const downloadedCollections = writable([]);
export const categoryData = writable(0);
export const categoryDetailData = writable(0);
export const settingsData = writable(0);
export const statisticsData = writable({
    "count": 100,
    "known": 0,
    "learning": 0,
    "unknown": 100
  });

export function resetStatistics(word) {
  statisticsData.set({
    "count": 100,
    "known": 0,
    "learning": 0,
    "unknown": 100
  });
}

export function updateStatistics(word) {
  let statistics = get(statisticsData);
  if (word.learning === undefined) {
    return
  }
  if (word.learning.read !== false && word.learning.write !== false && word.learning.listen !== false) {
    statistics.known += 1;
    statistics.unknown -= 1;
  } else {
    statistics.learning += 1;
    statistics.unknown -= 1;
  }
  statisticsData.set(statistics);
}
