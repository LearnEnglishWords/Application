import { _ } from 'svelte-i18n';
import { get } from 'svelte/store';
import DS from '../storages/data.js';
import CategoryGroup from './category-group.js';
import Category from './category.js';

export default class Collection {
  constructor(id, name, active, parentCollection = null) {
    this.id = id;
    this.name = name;
    this.words = [];
    this.active = active;
    this.categoryGroup = new CategoryGroup(id);
    this.parentCollection = parentCollection;

    if (this.active) {
      let getTranslate = get(_);

      this.title = getTranslate(`collection.items.${name}.title`);
      this.shortDescription = getTranslate(`collection.items.${name}.text`);
      this.fullDescription = getTranslate(`collection.items.${name}.description`);
    }
  }

  load() {
    this.loadCategories().then(() => {
      if (this.parentCollection !== null) {
        this.categoryGroup.concat(this.parentCollection.categoryGroup);
      }
      this.categoryGroup.loadWordIds(false);
    });
  }

  checkCategory(category, counter, numberCategories, resolve) {
    if (category.isLoaded()) {
      if (++counter === numberCategories) {
        resolve();
      }
    } else {
      setTimeout(() => {
        this.checkCategory(category, counter, numberCategories, resolve);
      }, 500);
    }
  }

  loadCategories() {
    let counter = 0;
    return new Promise((resolve) => {
      DS.getCategoryList(this.id).then((categories) => {
        categories.forEach((cat) => {
          let category = new Category(cat.id, this.id, cat.name, cat.czechName, cat.icon);
          category.loadWordIds(false);
          this.categoryGroup.push(category);
          this.checkCategory(category, counter, categories.length, resolve);
        });
      });
    });
  }
}
