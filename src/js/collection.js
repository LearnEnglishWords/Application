import { getDefaultStatisticsData, getDefaultModeStatisticsData, WordsType, Modes } from './utils.js'


export default class Collection {
  constructor() { }

  async downloadAllCategories(collectionId) {
    const res = await fetch(`https://drakeman.cz/api/collection/${collectionId}/categories`);
    var result = await res.json();
    if (result.payload === undefined) {
      return [];
    } else {
      return result.payload
    }
  }

  async downloadCategoryWords(categoryId, collectionId) {
    //const res = await fetch(`https://drakeman.cz/api/category/${categoryId}/words?collectionId=${collectionId}`);
    const res = await fetch(`https://drakeman.cz/api/category/${categoryId}/words`);
    var result = await res.json();
    if (result.payload === undefined) {
      return [];
    } else {
      return result.payload.words;
    }
  }

  async downloadCollectionWords(collectionId) {
    const res = await fetch(`https://drakeman.cz/api/collection/${collectionId}/words`);
    var result = await res.json();
    if (result.payload === undefined) {
      return [];
    } else {
      return result.payload
    }
  }

  saveCategory(collectionId, category, words, progress) {
    this.saveCategoryStatistics(collectionId, category.id, getDefaultStatisticsData(words.length));
    this.saveCategoryModeStatistics(collectionId, category.id, getDefaultModeStatisticsData(words.length));
    this.saveCategoryWords(collectionId, category.id, words, progress);
  }

  saveCategoryWords(collectionId, categoryId, words, progress) {
    let wordIds = words.map((word) => word.text);
    Object.values(Modes).forEach((value) => {
      this.saveWordIdsList(collectionId, categoryId, wordIds, WordsType.NOT_KNOWN, value);
    });

    this.saveWordIdsList(collectionId, categoryId, wordIds, WordsType.ALL, Modes.ALL).then(() => {
      words.forEach((word) => {
        this.getWord(word.text, (savedWord) => {
          if (savedWord === null) {
            this.saveWord(word.text, word).then(progress);
          } else {
            progress();
          }
        });
      });
    });
  }

  downloadCollection(collection, setupProgress, progress) {
    this.downloadCollectionWords(collection.id).then((words) => {
      let category = null;
      if (words.length > 0) {
        setupProgress(words.length);
        category = {
            "icon": "",
            "name": "All words",
            "czechName": collection.mainCategory,
            "wordsCount": words.length,
            "id": `collection_${collection.id}`
        }
        this.saveCategory(collection.id, category, words, progress);
      }

      this.downloadAllCategories(collection.id).then((categories) => {
        this.downloadCategories(collection.id, categories, setupProgress, progress);
        if (category !== null) { categories.unshift(category) }
        this.saveCategoryList(collection.id, categories);
      });
    });
  }

  downloadCategories(collectionId, categories, setupProgress, progress) {
    categories.forEach((category) => {
      this.downloadCategoryWords(category.id, collectionId).then((words) => {
        if (words !== undefined) {
          setupProgress(words.length);
          this.saveCategory(collectionId, category, words, progress);
        } 
      });
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

  validateMode(mode) {
    if(Object.values(Modes).includes(mode)) { return true }
    alert(`WordIdsList cannot be saved/loaded with Mode: '${mode}'`)
    return false
  }

  validateWordsType(type) {
    if([WordsType.ALL, WordsType.KNOWN, WordsType.NOT_KNOWN].includes(type)) { return true }
    alert(`WordIdsList cannot be saved/loaded with WordType: '${type}'`)
    return false
  }

  saveWordIdsList(collectionId, categoryId, words, type, mode) {
    if (!this.validateMode(mode) || !this.validateWordsType(type)) { return }
    return appStorage.setItem(`collection:${collectionId}:category:${categoryId}:type:${type}:mode:${mode}:word:ids`, words);
  }

  getWordIdsList(collectionId, categoryId, type, mode, callback) {
    if (!this.validateMode(mode) || !this.validateWordsType(type)) { return }
    return appStorage.getItem(`collection:${collectionId}:category:${categoryId}:type:${type}:mode:${mode}:word:ids`).then((data) => {
      callback(data);
    });
  }

  getWordIdsListPromise(collectionId, categoryId, type, mode) {
    if (!this.validateMode(mode) || !this.validateWordsType(type)) { return null }
    return appStorage.getItem(`collection:${collectionId}:category:${categoryId}:type:${type}:mode:${mode}:word:ids`);
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
