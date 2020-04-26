import Category from '../entities/category.js';
import Statistics from '../entities/statistics.js';
import { statisticsData, trainingModeStatisticsData } from '../store.js';


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
    this.loadStatistics();
    this.loadWordIds();
  }

  loadStatistics() {
    this.mainCategory.statistics = new Statistics(this.collectionId, this.id);
    this.categories.forEach((category) => {
      this.mainCategory.statistics = Statistics.plus(this.mainCategory.statistics, category.statistics);
    });
  }

  loadWordIds() {
    this.categories.forEach((category) => {
      Object.keys(category.wordStorages).forEach((mode) => {
        let thisWordIds = this.mainCategory.wordStorages[mode].getWordIds();
        let categoryWordIds = category.wordStorages[mode].getWordIds();
        this.mainCategory.wordStorages[mode].setWordIds(thisWordIds.concat(categoryWordIds));
      });
    });
  }

  updateStatistics(word, prevLearningState) {
    if (!this.mainCategory.wordStorages['all'].getWordIds().includes(word.text)) { return }

    this.mainCategory.statistics.update(word, prevLearningState);
    statisticsData.updateData();
    trainingModeStatisticsData.updateData();

    this.categories.forEach((category) => {
      if (category.wordStorages['all'].getWordIds().includes(word.text)) {  
        category.statistics.update(word, prevLearningState);
      }
    });
  }

  updateWords(mode, addWords, removeWords) {
    this.mainCategory.wordStorages[mode].update(addWords, removeWords);
    this.categories.forEach((category) => { 
      category.wordStorages[mode].update(addWords, removeWords);
    })
  }

  push(categories) {
    this.categories.push(categories);
  }

  concat(group) {
    group.categories.forEach((category) => this.push(category));
  }
}


