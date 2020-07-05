import { _ } from 'svelte-i18n';
import { get } from 'svelte/store';
import { WordsType, Collections } from '../utils.js'
import { isProduction, backendApiUrl } from '../config.js'
import DS from './data.js';


export default class CollectionStorage {
  constructor() {}

  async downloadAllCategories(collectionId) {
    const res = await fetch(`${backendApiUrl}/collection/${collectionId}/categories`);
    var result = await res.json();
    if (result.payload === undefined) {
      return [];
    } else {
      return result.payload
    }
  }

  async downloadCategoryWords(categoryId) {
    const res = await fetch(`${backendApiUrl}/category/${categoryId}/words?shuffle=${isProduction}&state=CORRECT`);
    var result = await res.json();
    if (result.payload === undefined) {
      return [];
    } else {
      return result.payload.words;
    }
  }

  async downloadCollectionWords(collectionId) {
    const res = await fetch(`${backendApiUrl}/collection/${collectionId}/words?shuffle=${isProduction}&state=CORRECT`);
    var result = await res.json();
    if (result.payload === undefined) {
      return [];
    } else {
      return result.payload
    }
  }

  async downloadPersonalWords() {
    const res = await fetch(`${backendApiUrl}/word/list?page=1&limit=3&state=CORRECT`);
    var result = await res.json();
    if (result.payload === undefined) {
      return [];
    } else {
      return result.payload.words
    }
  }
 
  async downloadUpdates(fromDate, progress) {
    const res = await fetch(`${backendApiUrl}/word/updated?from=${fromDate}`);
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
    let newCategory = {
      "name": "Example",
      "czechName": get(_)(`collection.items.${Collections.PERSONAL.name}.main_category`),
      "collectionId": Collections.PERSONAL.id,
      "id": 10001
    }
    DS.saveCategoryList(Collections.PERSONAL.id, [ newCategory ]);

    this.downloadPersonalWords().then((words) => {
      if (words !== undefined) {
        this.saveCategory(Collections.PERSONAL.id, newCategory, words, () => {});
      } 
    })
  }
}

