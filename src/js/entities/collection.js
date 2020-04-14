import { _ } from 'svelte-i18n';
import { get } from 'svelte/store';
import DS from '../storages/data.js';
import { WordsType, Modes } from '../utils.js'

export default class Collection {
  constructor(id, name, active) {
    this.id = id;
    this.name = name;
    this.categories = [];
    this.categoriesWithWords = [];
    this.words = [];
    this.active = active;
    this.mainCategoryTitle = null; 
    this.subCollection = [];

    if (this.active) {
      let getTranslate = get(_);

      this.title = getTranslate(`collection.items.${name}.title`);
      this.shortDescription = getTranslate(`collection.items.${name}.text`);
      this.fullDescription = getTranslate(`collection.items.${name}.description`);

      this._setupMainCategoryTitle()
    }
  }
  
  _setupMainCategoryTitle() {
    let getTranslate = get(_);
    let mainCategoryKey = `collection.items.${this.name}.main_category`;
    this.mainCategoryTitle = getTranslate(mainCategoryKey);

    if (mainCategoryKey === this.mainCategoryTitle) {
      this.mainCategoryTitle = getTranslate( `collection.items.main_category_default`)
    }
  }

  addSubCollection(collection) {
    this.subCollection.push(collection);
    this.categories = collection.categories.concat(this.categories);
    this.categoriesWithWords = collection.categoriesWithWords.concat(this.categoriesWithWords);
  }

  loadCategories() {
    DS.getCategoryList(this.id).then((categories) => {
      categories.forEach((category) => {
        DS.getWordIdsList(this.id, category.id, WordsType.ALL, Modes.ALL).then((wordIds) => {
          this.categoriesWithWords.push({"category": category, "wordIds": wordIds})
        });

        DS.getCategoryStatistics(this.id, category.id).then((stats) => {
          if (stats !== null) {
            category.stats = stats;
            category.active = false;
            DS.getCategoryModeStatistics(this.id, category.id)
              .then((modeStats) => { 
                category.modeStats = modeStats; 
              });
            this.categories.push(category);
          }
        });
      });
    });
  }
}
