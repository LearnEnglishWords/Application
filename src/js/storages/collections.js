import { _ } from 'svelte-i18n';
import { get } from 'svelte/store';
import { WordsType, Collections, AppInfo } from '../utils.js'
import { isProduction } from '../config.js'
import DS from './data.js';
import { settingsData } from '../store.js';


export default class CollectionStorage {

  async downloadAllCategories(collectionId) {
    const res = await fetch(`${get(settingsData).backendApiUrl}/collection/${collectionId}/categories`);
    if (!res.ok) {
      alert(get(_)('errors.server_is_not_available'));
      return [];
    }
    var result = await res.json();
    if (result.payload === undefined) {
      return [];
    } else {
      return result.payload
    }
  }

  async downloadCategoryWords(categoryId) {
    const res = await fetch(`${get(settingsData).backendApiUrl}/category/${categoryId}/words?shuffle=${isProduction}&state=CORRECT`);
    if (!res.ok) {
      alert(get(_)('errors.server_is_not_available'));
      return [];
    }
    var result = await res.json();
    if (result.payload === undefined) {
      return [];
    } else {
      return result.payload.words;
    }
  }

  async downloadCollectionWords(collectionId) {
    const res = await fetch(`${get(settingsData).backendApiUrl}/collection/${collectionId}/words?shuffle=${isProduction}&state=CORRECT`);
    if (!res.ok) {
      alert(get(_)('errors.server_is_not_available'));
      return [];
    }
    var result = await res.json();
    if (result.payload === undefined) {
      return [];
    } else {
      return result.payload
    }
  }
 
  async downloadUpdates(fromDate, progress) {
    const res = await fetch(`${get(settingsData).backendApiUrl}/word/updated?from=${fromDate}`);
    if (!res.ok) {
      alert(get(_)('errors.server_is_not_available'));
      progress(0, 0);
    }
    var result = await res.json();
    if (result.payload === undefined || result.payload.count === 0) {
      progress(0, 0);
    } 
    let words = result.payload.words;
    let counter = 0;
    words.forEach((updatedWord) => {
      DS.getWord(updatedWord.text).then((word) => {
        if (word === null) {
          progress(words.length, ++counter);
        } else {
          if (updatedWord.state === "CORRECT") {
            word.pronunciation = updatedWord.pronunciation;
            word.sense = updatedWord.sense;
            word.examples = updatedWord.examples;
            word.state = updatedWord.state;
            word.rank = updatedWord.rank;

            DS.saveWord(word.text, word).then(() => { 
              progress(words.length, ++counter);
            });
          } else {
            progress(words.length, ++counter);
          }
        }
      });
    });
  }

  saveCategoryWords(collectionId, categoryId, words, progress) {
    let wordIds = words.map((word) => word.text);
    DS.saveWordIdsList(collectionId, categoryId, wordIds, WordsType.UNKNOWN);
    DS.saveWordIdsList(collectionId, categoryId, [], WordsType.LEARNING);
    DS.saveWordIdsList(collectionId, categoryId, [], WordsType.KNOWN);
    DS.saveWordIdsList(collectionId, categoryId, [], WordsType.ALREADY_KNOWN);

    DS.saveWordIdsList(collectionId, categoryId, wordIds, WordsType.ALL).then(() => {
      words.forEach((word) => {
        DS.getWord(word.text).then((savedWord) => {
          if (savedWord === null) {
            DS.saveWord(word.text, word).then(progress);
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
            "czechName": collection.mainCategoryTitle,
            "wordsCount": words.length,
            "id": `collection_${collection.id}`
        }
        this.saveCategoryWords(collection.id, category.id, words, progress);
      }

      this.downloadAllCategories(collection.id).then((categories) => {
        this.downloadAndSaveCategories(collection.id, categories, setupProgress, progress);
        if (category !== null) { categories.unshift(category) }
        DS.saveCategoryList(collection.id, categories);
      });
    });
  }

  downloadAndSaveCategories(collectionId, categories, setupProgress, progress) {
    categories.forEach((category) => {
      this.downloadCategoryWords(category.id, collectionId).then((words) => {
        if (words !== undefined) {
          setupProgress(words.length);
          this.saveCategoryWords(collectionId, category.id, words, progress);
        } 
      });
    });
  }

  createPersonalCollection() {
    this.createPersonalCategory(get(_)(`collection.items.${Collections.PERSONAL.name}.main_category`));
  }

  createPersonalCategory(categoryName) {
    return new Promise((resolve) => {
      DS.getAppInfo(AppInfo.NUMBER_PERSONAL_CATEGORIES).then((data) => { 
        let numberCategories = data === null ? 1 : data + 1;

        let newCategory = {
          "name": "PersonalCategory" + numberCategories,
          "czechName": categoryName,
          "collectionId": Collections.PERSONAL.id,
          "id": 10000 + numberCategories
        }

        DS.saveAppInfo(AppInfo.NUMBER_PERSONAL_CATEGORIES, numberCategories);
        this.saveNewCategory(Collections.PERSONAL.id, newCategory, resolve);
      });
    });
  }

  saveNewCategory(collectionId, newCategory, resolve) {
    DS.getCategoryList(collectionId).then((categories) => {
      if (categories === null) {
        DS.saveCategoryList(collectionId, [ newCategory ]);
      } else {
        categories.push(newCategory);
        DS.saveCategoryList(collectionId, categories);
      }
      this.saveCategoryWords(collectionId, newCategory.id, [], () => {});
      resolve(newCategory);
    });
  }
}
