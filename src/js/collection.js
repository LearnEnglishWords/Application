import Storage from './storage.js';


export default class Collection {
  constructor() { 
    this.storage = new Storage(LocalFileSystem.TEMPORARY);
    this.rootDirectory = cordova.file.cacheDirectory;
  }

  download(collectionId, success, progress) {
    downloader.init({folder: collectionId, fileSystem: this.rootDirectory, unzip: true});
    downloader.get(`https://drakeman.cz/english-words/collections/${collectionId}.zip`);

    document.addEventListener("DOWNLOADER_unzipSuccess", (event) => {
      this.loadCategoryList(collectionId, (categories) => {
        this.saveCategoryList(collectionId, categories).then(() => {
          success();
        });
        for (let categoryId of categories) {
          this.loadWordList(collectionId, categoryId, (words) => {
            let parsedWords = JSON.parse(words);
            let wordIds = parsedWords.map((word) => { return word.text });
            this.saveWordList(collectionId, categoryId, wordIds).then(() => {
              for (let word of parsedWords) {
                this.saveWord(word.text, word);
              }
              this.getWordList(collectionId, categoryId, (words) => progress())
            });
          });
        }
      });
    });
  }

  loadCategoryList(collectionId, success, error) {
    this.storage.list_dir(
      `${this.rootDirectory}/${collectionId}/words`, 
      (entries) => {
        let categories = [];
        for (var i=0; i<entries.length; i++) {
          categories[i] = entries[i].name.slice(0,-5);
        }
        success(categories.sort());
      }
    );
  }

  saveCategoryList(collectionId, categories) {
    let defaultStatistics = {
      "count": 100,
      "known": 0,
      "learning": 0,
      "unknown": 100
    }
    for (categoryId of categories) {
      this.saveCategoryStatistics(collectionId, categoryId, defaultStatistics);
    }
    return appStorage.setItem(`collection:${collectionId}:category:ids`, categories);
  }

  getCategoryList(collectionId, callback) {
    appStorage.getItem(`collection:${collectionId}:category:ids`).then((data) => {
      callback(data);
    });
  }


  loadWordList(collectionId, categoryId, success, error) {
    this.storage.read(`/${collectionId}/words/${categoryId}.json`, (result) => {
      success(result);
    });
  }

  saveWordList(collectionId, categoryId, words) {
    return appStorage.setItem(`collection:${collectionId}:category:${categoryId}:word:ids`, words);
  }

  getWordList(collectionId, categoryId, callback) {
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

  saveAppInfo(id, content) {
    return appStorage.setItem(`info:${id}`, content);
  }

  getAppInfo(id, callback) {
    return appStorage.getItem(`info:${id}`).then((data) => {
      callback(data);
    });
  }
}
