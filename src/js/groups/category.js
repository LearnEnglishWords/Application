import { _ } from 'svelte-i18n';
import DS from '../storages/data.js';
import Category from '../entities/category.js';
import Statistics from '../entities/statistics.js';
import { getDefaultStatisticsData, getDefaultModeStatisticsData, WordsType, Modes } from '../utils.js'


export default class CategoryGroup {
  constructor(collectionId, categories = []) {
    this.collectionId = collectionId;
    this.categories = categories;

    this.mainCategory = new Category(null, collectionId, null, null);

    if (this.categories.length > 0) {
      this.load();
    }
  }

  load() {
    this.categories.forEach((category) => {
      this.mainCategory.statistics = Statistics.plus(this.mainCategory.statistics, category.statistics);

      // load words
      Object.keys(category.wordStorages).forEach((mode) => {
        let thisWordIds = this.mainCategory.wordStorages[mode].getWordIds();
        let categoryWordIds = category.wordStorages[mode].getWordIds();
        this.mainCategory.wordStorages[mode].setWordIds(thisWordIds.concat(categoryWordIds));
      });
    });
  }

  updateStatistics(word, prevState, modes) {
    if (!this.mainCategory.wordStorages['all'].getWordIds.includes(word.text)) { return }

    this.statistics.update(word, prevState);

    this.categories.forEach((category) => {
      if (category.wordStorages['all'].getWordIds.includes(word.text)) {  
        category.statistics.update(word, prevState);
      }
    });
  }

  push(categories) {
    this.categories.push(categories);
  }

  concat(group) {
    group.categories.forEach((category) => this.push(category));
  }
}


