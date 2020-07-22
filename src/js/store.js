import { writable } from 'svelte/store';
import { 
  defaultSettingsData, 
} from './utils.js'


export const trainingData = writable(0);
export const downloadedCollections = writable([]);
export const allCollectionsData = writable([]);
export const collectionData = writable(0);
export const categoryData = writable(0);
export const categoryGroupData = writable(null);
export const categoryDetailData = writable(0);
export const settingsData = writable({...defaultSettingsData});
export const modeStatisticsData = writable(null);
export const statisticsData = writable(null);
export const deviceUUID = writable(null);
export const lastCollectionId = writable(null);
