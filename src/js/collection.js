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
      this.loadCategories(collectionId, (categories) => {
        this.saveCategories(collectionId, categories).then(() => {
          success();
        });
        for (let categoryId of categories) {
          this.loadWords(collectionId, categoryId, (words) => {
            this.saveWords(collectionId, categoryId, words).then(() => {
              progress();
            });
          });
        }
      });
    });
  }

  loadCategories(collectionId, success, error) {
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

  saveCategories(collectionId, categories) {
    return appStorage.setItem(`collection:${collectionId}:category:list`, categories);
  }

  getCategories(collectionId, callback){
    appStorage.getItem(`collection:${collectionId}:category:list`).then((data) => {
      callback(data);
    });
  }


  loadWords(collectionId, categoryId, success, error) {
    this.storage.read(`/${collectionId}/words/${categoryId}.json`, (result) => {
      success(result);
    });
  }

  saveWords(collectionId, categoryId, words) {
    return appStorage.setItem(`collection:${collectionId}:category:${categoryId}:word:list`, words);
  }

  getWords(collectionId, categoryId, callback){
    return appStorage.getItem(`collection:${collectionId}:category:${categoryId}:word:list`).then((data) => {
      callback(data);
    });
  }
}
