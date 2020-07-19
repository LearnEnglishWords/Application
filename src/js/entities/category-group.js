import Category from '../entities/category.js';
import { deduplicate } from '../utils.js';


export default class CategoryGroup {
  constructor(collectionId, categories = [], zipCategories = false) {
    this.collectionId = collectionId;
    this.categories = categories;

    this.mainCategory = new Category(`collection_${collectionId}`, collectionId, null, null);

    if (this.categories.length > 0) {
      this.loadWordIds(zipCategories);
    }
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

  loadWordIds(withZip = true) {
    this.categories.forEach((category, index) => {
      Object.keys(category.wordStorages).forEach((mode) => {
        let thisWordIds = this.mainCategory.wordStorages[mode].getWordIds();
        let categoryWordIds = category.wordStorages[mode].getWordIds();

        if (withZip) {
          this.mainCategory.wordStorages[mode].setWordIds(index === 0 ? categoryWordIds : deduplicate(this._zip(thisWordIds, categoryWordIds, index)));
        } else {
          this.mainCategory.wordStorages[mode].setWordIds(deduplicate(thisWordIds.concat(categoryWordIds)));
        }
      });
    });
  }

  updateWord(word, state, trainingType, trainingMode) {
    this.categories.forEach((category) => {
      category.updateWord(word, state, trainingType, trainingMode);
    });
  }

  updateWordList(wordList, setAs, progress) {
    if (this._isCoreCollection()) {
      this.mainCategory.updateWordList(wordList, setAs, progress);
    } else {
      this.categories.forEach((category) => {
        category.updateWordList(wordList, setAs, progress);
      });
      this.mainCategory.updateWordList(wordList, setAs);
    }
  }

  push(category) {
    this.categories.push(category);
  }

  concat(group) {
    group.categories.forEach((category) => this.push(category));
  }

  _isCoreCollection() {
    return this.collectionId !== undefined
  }

  _zip(arr1, arr2, s = 1) {
    let array = [];
    for (let i = 0; i < arr1.length + arr2.length*s; i++) {
      if (arr1.length > i) {
        array.push(arr1[i]);
      }
      if (arr2.length > i/s && i % s === 0) {
        array.push(arr2[i/s]);
      }
    }
    return array
  }
}


