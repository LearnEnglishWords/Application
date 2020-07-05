import Category from '../entities/category.js';


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
    this.loadWordIds();
  }

  getStatistics() {
    let stats = this.mainCategory.getStatistics();
    this.categories.forEach((category) => {
      stats.count += category.statistics.count;
      stats.known += category.statistics.known;
      stats.unknown += category.statistics.unknown;
      stats.learning += category.statistics.learning;
    });
    return stats
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

  updateWord(word, state, trainingType, trainingMode) {
    this.categories.forEach((category) => {
      category.updateWord(word, state, trainingType, trainingMode);
    });
  }

  push(category) {
    this.categories.push(category);
  }

  concat(group) {
    group.categories.forEach((category) => this.push(category));
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


