import { _ } from 'svelte-i18n';
import { get } from 'svelte/store';
import DS from '../storages/data.js';
import WordsStorage from '../storages/words.js';
import Statistics from './statistics.js';
import { getDefaultStatisticsData, getDefaultModeStatisticsData, WordsType, Modes } from '../utils.js'


export default class Category {
  constructor(id, collectionId, name, title) {
    this.id = id;
    this.collectionId = collectionId;
    this.name = name;
    this.title = title;
    this.active = true;
    this.wordStorages = {
      'all': new WordsStorage(collectionId, id, 'all', 100),
      'read': new WordsStorage(collectionId, id, 'read', 100),
      'write': new WordsStorage(collectionId, id, 'write', 100),
      'listen': new WordsStorage(collectionId, id, 'listen', 100),
    };
    this.statistics = new Statistics(
      this.collectionId, this.id, 
      getDefaultStatisticsData(), 
      getDefaultModeStatisticsData()
    );
  }

  loadWordIds() {
    Object.values(this.wordStorages).forEach((wordsStorage) => {
      wordsStorage.loadIds(false)
    });
  }

  loadWords(type) {
    this.wordStorages[type].loadWords();
  }

  loadStatistics() {
    return this.statistics.load();
  }

  save() {
  }
}

