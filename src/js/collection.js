import Storage from './storage.js';


export default class Collection {
  constructor() { 
    this.storage = new Storage();
  }

  download(collectionId, success, error) {
    downloader.init({folder: collectionId, fileSystem: cordova.file.cacheDirectory, unzip: true});
    downloader.get(`https://drakeman.cz/english-words/collections/${collectionId}.zip`);

    document.addEventListener("DOWNLOADER_unzipSuccess", (event) => {
      this.loadCategories(collectionId, (categories) => {
        this.saveCategories(collectionId, categories).then(() => {
          success();
        });
      });
    });
  }

  loadCategories(collectionId, success, error) {
    this.storage.list_dir(
      `${cordova.file.cacheDirectory}/${collectionId}/words`, 
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
    return appStorage.getItem(`collection:${collectionId}:category:list`).then((data) => {
      callback(data);
    });
  }
}
