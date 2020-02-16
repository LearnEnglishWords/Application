import Storage from './storage.js';


export default class Collection {
  constructor() { 
    this.storage = new Storage();
  }

  download(collectionName, success, error) {
    downloader.init({folder: collectionName, fileSystem: cordova.file.cacheDirectory, unzip: true});
    downloader.get(`https://drakeman.cz/english-words/collections/${collectionName}.zip`);

    document.addEventListener("DOWNLOADER_unzipSuccess", (event) => {
      this.loadCategories(collectionName, (categories) => {
        this.saveCategories(collectionName, categories).then(() => {
          success();
        });
      });
    });
  }

  loadCategories(collectionName, success, error) {
    this.storage.list_dir(
      `${cordova.file.cacheDirectory}/${collectionName}/words`, 
      (entries) => {
        let categories = [];
        for (var i=0; i<entries.length; i++) {
          categories[i] = entries[i].name.slice(0,-5);
        }
        success(categories.sort());
      }
    );
  }

  saveCategories(collectionName, categories) {
    return appStorage.setItem(`collection:${collectionName}:category:list`, categories);
  }

  getCategories(collectionName, callback){
    return appStorage.getItem(`collection:${collectionName}:category:list`).then((data) => {
      callback(data);
    });
  }


}
