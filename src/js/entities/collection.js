import { _ } from 'svelte-i18n';
import { get } from 'svelte/store';
import DS from '../storages/data.js';
import CategoryGroup from './category-group.js';
import Category from './category.js';
//import WordUpdater from './word-updater.js';

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
      this.categoryGroup.load();
    });
  }

  //isLoaded() {
  //  let modeStats = this.categoryGroup.categories[0].statistics;
  //  return !(modeStats.known === 0 && modeStats.unknown === 0)
  //}

  //updateLearningWords() {
  //  return new Promise((resolve) => {
  //    this.categoryGroup.categories.forEach((category, index) => {
  //      WordUpdater.updateLearningWords(category).then(() => {
  //        if(index+1 === this.categoryGroup.categories.length) {
  //          resolve();
  //        }
  //      });
  //    });
  //  });
  //}

  loadCategories() {
    let counter = 0;
    return new Promise((resolve) => {
      DS.getCategoryList(this.id).then((categories) => {
        categories.forEach((cat) => {
          let category = new Category(cat.id, this.id, cat.name, cat.czechName, cat.icon);
          category.loadWordIds();
          this.categoryGroup.push(category);
          if (++counter === categories.length) {
            setTimeout(resolve, 100);
          }
        });
      });
    });
  }
}
