import { _ } from 'svelte-i18n';
import { get } from 'svelte/store';
import { WordsType, Modes } from '../utils.js'
import DS from '../storages/data.js';
import Category from './category.js';

export default class Collection {
  constructor(id, name, active, parentCollection) {
    this.id = id;
    this.name = name;
    this.categories = [];
    this.words = [];
    this.active = active;
    this.mainCategoryTitle = null; 
    this.parentCollection = parentCollection;
    this.mainCategory = null;

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

  setupMainCategory() {
    if (this.parentCollection === undefined) return
    this.mainCategory = this.categories[0]; 

    this.parentCollection.categories.forEach((c) => {
      this.mainCategory = this.mainCategory.plus(c);
    });
    this.categories = [this.mainCategory];
  }

  loadCategories() {
    let counter = 0;
    return new Promise((resolve, reject) => {
      DS.getCategoryList(this.id).then((categories) => {
        categories.forEach((cat) => {
          let category = new Category(cat.id, this.id, cat.name, cat.czechName);
          category.loadWordIds();
          category.loadStatistics().then(() => {if (++counter === categories.length) {resolve()}});
          this.categories.push(category);
        });
      });
    });
  }

  updateStatistics(word, prevState, modes) {
    if ([2,7,3].includes(this.id)) {
      let categoryId = `collection_${this.id}`;
      DS.getCategoryStatistics(this.id, categoryId).then((stats) => {
        if (stats !== null) {
          alert("test1")
          stats.updateData(word, prevState);
          alert("test2")
          this.categories[0].statistics.updateData(word, prevState);
          alert("test3")
          DS.saveCategoryStatistics(this.id, categoryId, get(stats));
        }
      });
      DS.getCategoryModeStatistics(this.id, categoryId).then((modeStats) => { 
        if (modeStats !== null) {
          modeStats.updateData(word, prevState); 
          this.categories[0].modeStatistics.updateData(word, prevState); 
          DS.saveCategoryModeStatistics(this.id, categoryId, get(modeStats));
        }
      });
    } else {
      this.categories.forEach((category) => { category.updateStatistics(word, prevState, modes) });
    }
  }
}
