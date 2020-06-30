import Category from '../entities/category.js';
import Statistics from '../entities/statistics.js';
import { statisticsData, allKnownWordsData, allNotKnownWordsData } from '../store.js';


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
      //this.mainCategory.statistics = Statistics.plus(this.mainCategory.statistics, category.statistics);
      this.mainCategory.statistics.count += category.statistics.count;
      this.mainCategory.statistics.known += category.statistics.known;
      this.mainCategory.statistics.unknown += category.statistics.unknown;
      this.mainCategory.statistics.learning += category.statistics.learning;
    });
  }

  loadWordIds() {
    this.categories.forEach((category, index) => {
      Object.keys(category.wordStorages).forEach((mode) => {
        let thisWordIds = this.mainCategory.wordStorages[mode].getWordIds();
        let categoryWordIds = category.wordStorages[mode].getWordIds();

        this.mainCategory.wordStorages[mode].setWordIds(index === 0 ? categoryWordIds : this._zip(thisWordIds, categoryWordIds, index));
      });
    });
  }

  updateStatistics(word, prevLearningState) {
    if (!this.mainCategory.wordStorages['all'].getWordIds().includes(word.text)) { return }

    this.mainCategory.statistics.update(word, prevLearningState);
    statisticsData.updateData();
    //trainingModeStatisticsData.updateData();

    this.categories.forEach((category) => {
      if (category.wordStorages['all'].getWordIds().includes(word.text)) {  
        category.statistics.update(word, prevLearningState);
      }
    });
  }

  updateWords(mode, addWords, removeWords) {
    this.mainCategory.wordStorages[mode].update(addWords, removeWords);
    this.categories.forEach((category) => { 
      category.wordStorages[mode].update(
        addWords.filter((wordId) => category.wordStorages['all'].getWordIds().includes(wordId)), 
        removeWords
      );
    });
    allKnownWordsData.updateData(mode, removeWords, []);
    allNotKnownWordsData.updateData(mode, addWords, removeWords);
  }

  push(category) {
    this.categories.push(category);
  }

  concat(group) {
    group.categories.forEach((category) => this.push(category));
  }

  updateKnownWordList(word) {
    this.categories.forEach((category) => { 
      category.updateKnownWordList(word);
    });
  }

  _zip(arr1, arr2, s = 1) {
    let array = [];
    let arrLength = 0;
    if (arr1.length > arr2.length*s) {
      arrLength = arr1.length;
    } else {
      arrLength = arr2.length*s;
    }

    for (let i = 0; i < arrLength; i++) {
      if (arr1.length > i) {
        array.push(arr1[i]);
      }
      if (arr2.length > i && i % s === 0) {
        array.push(arr2[i/s]);
      }
    }
    return array
  }
}


