import { writable } from 'svelte/store';

function createTrainingData() {
  const { subscribe, set, update } = writable({ mode: 0, limit: 30 });

  return {
    subscribe,
    setMode: (mode) => update(data => {data.mode = mode; return data}),
    setLimit: (limit) => update(data => {data.limit = limit; return data}),
    reset: () => set({ mode: 0, limit: 30 })
  };
}

export const trainingData = createTrainingData();
export const collectionData = writable(0);
export const categoryData = writable(0);
export const categoryDetailData = writable(0);
export const settingsData = writable(0);
export const statisticsData = writable(0);
