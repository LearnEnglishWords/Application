import { writable } from 'svelte/store';
import { 
  defaultSettingsData, 
  getDefaultStatisticsData,
  getDefaultModeStatisticsData 
} from './utils.js'

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


export const trainingData = writable(0);
export const allCollectionsData = writable([]);
export const collectionData = writable(0);
export const categoryGroupData = writable(null);
export const downloadedCollections = writable([]);
export const categoryDetailData = writable(0);
export const settingsData = writable({...defaultSettingsData});
export const trainingModeStatisticsData = createModeStatisticsData({...getDefaultModeStatisticsData(100)});
export const statisticsData = createStatisticsData({...getDefaultStatisticsData(100)});
