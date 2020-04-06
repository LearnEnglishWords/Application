import { getDefaultStatisticsData, getDefaultModeStatisticsData } from './utils.js'


export default class Collection {
  constructor() { }

  async downloadAllCategories() {
    const res = await fetch(`https://drakeman.cz/api/category/list/`);
    var result = await res.json();
    return result.payload
  }

  async downloadCategoryWords(categoryId, collectionId) {
    const res = await fetch(`https://drakeman.cz/api/category/${categoryId}/words?collectionId=${collectionId}`);
    var result = await res.json();
    return result.payload.words;
  }

  downloadAndSaveCategoryWords(collectionId, categories, progress) {
    categories.forEach((category) => {
      this.downloadCategoryWords(category.id, collectionId).then((words) => {
        if (words !== undefined) {
          this.saveCategoryStatistics(collectionId, category.id, getDefaultStatisticsData(words.length));
          this.saveCategoryModeStatistics(collectionId, category.id, getDefaultModeStatisticsData(words.length));
          this.saveCategoryWords(collectionId, category.id, words, progress);
        } else {
          progress();
        }
      });
    });
  }

  saveCategoryWords(collectionId, categoryId, words, progress) {
    let wordIds = words.map((word) => word.text);
    this.saveCategoryWordIdsList(collectionId, categoryId, wordIds).then(() => {
      words.forEach((word) => this.saveWord(word.text, word));
      this.getWordIdsList(collectionId, categoryId, progress)
    });
  }

  download(collectionId, success, progress) {
    this.downloadAllCategories().then((categories) => {
      this.saveCategoryList(collectionId, categories).then(() => success());
      this.downloadAndSaveCategoryWords(collectionId, categories, progress);
    });
  }

  saveCategoryList(collectionId, categories) {
    return appStorage.setItem(`collection:${collectionId}:categories`, categories);
  }

  getCategoryList(collectionId, callback) {
    appStorage.getItem(`collection:${collectionId}:categories`).then((data) => {
      callback(data);
    });
  }

  saveCategoryWordIdsList(collectionId, categoryId, words) {
    return appStorage.setItem(`collection:${collectionId}:category:${categoryId}:word:ids`, words);
  }

  getWordIdsList(collectionId, categoryId, callback) {
    return appStorage.getItem(`collection:${collectionId}:category:${categoryId}:word:ids`).then((data) => {
      callback(data);
    });
  }

  saveWord(wordId, word) {
    return appStorage.setItem(`word:${wordId}`, word);
  }

  getWord(wordId, callback) {
    return appStorage.getItem(`word:${wordId}`).then((data) => {
      callback(data);
    });
  }

  saveCategoryStatistics(collectionId, categoryId, statistics) {
    return appStorage.setItem(`collection:${collectionId}:category:${categoryId}:statistics`, statistics);
  }

  getCategoryStatistics(collectionId, categoryId, callback) {
    return appStorage.getItem(`collection:${collectionId}:category:${categoryId}:statistics`).then((data) => {
      callback(data);
    });
  }

  getCategoryStatisticsPromise(collectionId, categoryId) {
    return appStorage.getItem(`collection:${collectionId}:category:${categoryId}:statistics`)
  }

  saveCategoryModeStatistics(collectionId, categoryId, statistics) {
    return appStorage.setItem(`collection:${collectionId}:category:${categoryId}:mode_statistics`, statistics);
  }

  getCategoryModeStatistics(collectionId, categoryId, callback) {
    return appStorage.getItem(`collection:${collectionId}:category:${categoryId}:mode_statistics`).then((data) => {
      callback(data);
    });
  }

  getCategoryModeStatisticsPromise(collectionId, categoryId) {
    return appStorage.getItem(`collection:${collectionId}:category:${categoryId}:mode_statistics`)
  }

  saveAppInfo(id, content) {
    return appStorage.setItem(`info:${id}`, content);
  }

  getAppInfo(id, callback) {
    return appStorage.getItem(`info:${id}`).then((data) => {
      callback(data);
    });
  }

  saveSettings(content) {
    return appStorage.setItem(`settings`, content);
  }

  getSettings(callback) {
    return appStorage.getItem(`settings`).then((data) => {
      callback(data);
    });
  }
}
