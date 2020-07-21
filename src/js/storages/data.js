import Validator from '../validator.js'


export default class DataStorage {

  static saveCategoryList(collectionId, categories) {
    return appStorage.setItem(`collection:${collectionId}:categories`, categories);
  }

  static getCategoryList(collectionId) {
    return appStorage.getItem(`collection:${collectionId}:categories`);
  }

  static saveWordIdsList(collectionId, categoryId, words, type) {
    if (!Validator.isWordsType(type)) {
      alert(`WordIdsList cannot be saved with WordType: '${type}'`)
      return 
    }
    if (collectionId === undefined || categoryId === null) { return }
    return appStorage.setItem(`collection:${collectionId}:category:${categoryId}:type:${type}:word:ids`, words);
  }

  static removeWordIdsList(collectionId, categoryId, type) {
    if (!Validator.isWordsType(type)) {
      alert(`WordIdsList cannot be saved with WordType: '${type}'`)
      return 
    }
    if (collectionId === undefined || categoryId === null) { return }
    return appStorage.removeItem(`collection:${collectionId}:category:${categoryId}:type:${type}:word:ids`);
  }

  static getWordIdsList(collectionId, categoryId, type) {
    if (!Validator.isWordsType(type)) {
      alert(`WordIdsList cannot be loaded with WordType: '${type}'`)
      return 
    }
    return appStorage.getItem(`collection:${collectionId}:category:${categoryId}:type:${type}:word:ids`);
  }

  static saveWord(wordId, word) {
    return appStorage.setItem(`word:${wordId}`, word);
  }

  static getWord(wordId) {
    return appStorage.getItem(`word:${wordId}`);
  }

  static saveCategoryStatistics(collectionId, categoryId, statistics) {
    if (categoryId === undefined || categoryId === null) { return }
    return appStorage.setItem(`collection:${collectionId}:category:${categoryId}:statistics`, statistics);
  }

  static getCategoryStatistics(collectionId, categoryId) {
    return appStorage.getItem(`collection:${collectionId}:category:${categoryId}:statistics`);
  }

  static saveAppInfo(id, content) {
    return appStorage.setItem(`info:${id}`, content);
  }

  static getAppInfo(id) {
    return appStorage.getItem(`info:${id}`);
  }

  static saveSettings(content) {
    return appStorage.setItem(`settings`, content);
  }

  static getSettings() {
    return appStorage.getItem(`settings`);
  }
}

