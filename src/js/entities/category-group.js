import Category from '../entities/category.js';
//import DS from '../storages/data.js';
//import { statisticsData } from '../store.js';
//import { getDefaultStatisticsData } from '../utils.js';


export default class CategoryGroup {
  constructor(collectionId, categories = []) {
    this.collectionId = collectionId;
    this.categories = categories;

    this.mainCategory = new Category(`collection_${collectionId}`, collectionId, null, null);

    if (this.categories.length > 0) {
      this.load();
    }
  }

  load() {
    //this.loadStatistics();
    this.loadWordIds();
  }

  getStatistics() {
    //if (coreCollections.includes(this.collectionId)) {
    //  DS.getCategoryStatistics(this.collectionId, `collection_${this.collectionId}`).then((stats) => {
    //    this.mainCategory.statistics = stats;
    //  });
    //} else {
      let stats = this.mainCategory.getStatistics();
      this.categories.forEach((category) => {
        //this.mainCategory.statistics = Statistics.plus(this.mainCategory.statistics, category.statistics);
        stats.count += category.statistics.count;
        stats.known += category.statistics.known;
        stats.unknown += category.statistics.unknown;
        stats.learning += category.statistics.learning;
      });
      return stats
    //}
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

  updateWord(word, state, trainingType) {
    this.categories.forEach((category) => {
      category.updateWord(word, state, trainingType);
    });
  }

  //updateStatistics(word) {
  //  if (!this.mainCategory.wordStorages['all'].getWordIds().includes(word.text)) { return }

  //  if (isKnown(word)) {
  //    this.mainCategory.statistics.known += 1;
  //    this.mainCategory.statistics.learning -= 1;
  //  } else {
  //    this.mainCategory.statistics.learning += 1;
  //    this.mainCategory.statistics.unknown -= 1;
  //  }
  //  statisticsData.updateData();
  //  //trainingModeStatisticsData.updateData();

  //  this.categories.forEach((category) => {
  //    if (category.wordStorages['all'].getWordIds().includes(word.text)) {  
  //      category.updateStatistics(word);
  //    }
  //  });
  //}

  //updateWords(mode, addWords, removeWords) {
  //  this.mainCategory.wordStorages[mode].update(addWords, removeWords);
  //  this.categories.forEach((category) => { 
  //    category.wordStorages[mode].update(
  //      addWords.filter((wordId) => category.wordStorages['all'].getWordIds().includes(wordId)), 
  //      removeWords
  //    );
  //  });
  //  //allKnownWordsData.updateData(mode, removeWords, []);
  //  //allNotKnownWordsData.updateData(mode, addWords, removeWords);
  //}

  push(category) {
    this.categories.push(category);
  }

  concat(group) {
    group.categories.forEach((category) => this.push(category));
  }

  //updateKnownWordList(word) {
  //  this.categories.forEach((category) => { 
  //    category.updateKnownWordList(word);
  //  });
  //}

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


