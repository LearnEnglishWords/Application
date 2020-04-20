import { _ } from 'svelte-i18n';
import { get } from 'svelte/store';
import DS from '../storages/data.js';
import WordsStorage from '../storages/words.js';
import { getDefaultStatisticsData, getDefaultModeStatisticsData, WordsType, Modes } from '../utils.js'


export default class Category {
  constructor(id, collectionId, name, title, subCategories = []) {
    this.id = id;
    this.collectionId = collectionId;
    this.name = name;
    this.title = title;
    this.active = true;
    this.wordStorages = {
      'original': new WordsStorage(collectionId, id, 'all', 100),
      'read': new WordsStorage(collectionId, id, 'read', 100),
      'write': new WordsStorage(collectionId, id, 'write', 100),
      'listen': new WordsStorage(collectionId, id, 'listen', 100),
    }
    this.statistics = getDefaultStatisticsData();
    this.modeStatistics = getDefaultModeStatisticsData();
    this.subCategories = subCategories;

    if (id === null && this.subCategories.length > 0) {
      this._concat();
    }
  }

  _plusStats(stats1, stats2) {
    let newStats = {};
    Object.keys(stats2).forEach((key) => {
      newStats[key] = stats1[key] + stats2[key];
    });
    return newStats
  }

  _concat() {
    this.subCategories.forEach((category) => {

      this.statistics = this._plusStats(this.statistics, category.statistics);
      Object.keys(this.modeStatistics).forEach((mode) => {
        this.modeStatistics[mode] = this._plusStats(this.modeStatistics[mode], category.modeStatistics[mode]);
      });

      Object.keys(category.wordStorages).forEach((key) => {
        let thisWordIds = this.wordStorages[key].getWordIds();
        let categoryWordIds = category.wordStorages[key].getWordIds();
        this.wordStorages[key].setWordIds(thisWordIds.concat(categoryWordIds));
      });
    });
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
    return new Promise((resolve, reject) => {
      DS.getCategoryStatistics(this.collectionId, this.id).then((stats) => {
        if (stats !== null) {
          this.statistics = stats;
          DS.getCategoryModeStatistics(this.collectionId, this.id)
            .then((modeStats) => { 
              this.modeStatistics = modeStats; 
              resolve();
            });
        }
      });
    });
  }

  plus(category) {
    if (this.id === null) {
      return new Category(null, this.collectionId, null, null, this.subCategories.concat(category))
    } else {
      return new Category(null, this.collectionId, null, null, [this, category])
    }
  }

  updateStatistics(word, prevState, modes) {
    if (!this.wordStorages['original'].getWordIds.includes(word.text)) { return }
    this.statistics.updateData(word, prevState);
    this.modeStatistics.updateData(word, modes);

    if (this.id !== null) {
      DS.saveCategoryStatistics(this.collectionId, this.id, get(this.statistics));
      DS.saveCategoryModeStatistics(this.collectionId, this.id, get(this.modeStatistics));
    }
  }
}

