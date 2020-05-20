import Validator from '../validator.js'
import { WordsType } from '../utils.js'


export default class DataStorage {

  static saveCategoryList(collectionId, categories) {
    return appStorage.setItem(`collection:${collectionId}:categories`, categories);
  }

  static getCategoryList(collectionId) {
    return appStorage.getItem(`collection:${collectionId}:categories`);
  }

  static saveWordIdsList(collectionId, categoryId, words, type, mode) {
    if (!Validator.isMode(mode) || !Validator.isWordsType(type)) {
      alert(`WordIdsList cannot be saved with Mode: '${mode}' and WordType: '${type}'`)
      return 
    }
    if (collectionId === undefined || categoryId === null) { return }
    return appStorage.setItem(`collection:${collectionId}:category:${categoryId}:type:${type}:mode:${mode}:word:ids`, words);
  }

  static getWordIdsList(collectionId, categoryId, type, mode) {
    if (!Validator.isMode(mode) || !Validator.isWordsType(type)) {
      alert(`WordIdsList cannot be loaded with Mode: '${mode}' and WordType: '${type}'`)
      return 
    }
    return appStorage.getItem(`collection:${collectionId}:category:${categoryId}:type:${type}:mode:${mode}:word:ids`);
  }

  static saveAllLearningWords(type, mode, wordIds) {
    return DataStorage.saveWordIdsList('all', 'learningWords', wordIds, type, mode)
  }

  static getAllLearningWords(type, mode) {
    return DataStorage.getWordIdsList('all', 'learningWords', type, mode)
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

  static saveCategoryModeStatistics(collectionId, categoryId, statistics) {
    if (categoryId === undefined || categoryId === null) { return }
    return appStorage.setItem(`collection:${collectionId}:category:${categoryId}:mode_statistics`, statistics);
  }

  static getCategoryModeStatistics(collectionId, categoryId) {
    return appStorage.getItem(`collection:${collectionId}:category:${categoryId}:mode_statistics`);
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

