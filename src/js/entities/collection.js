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
      this.categoryGroup.load();
    });
  }

  isLoaded() {
    let modeStats = this.categoryGroup.categories[0].statistics.modeStats;
    return !(modeStats.read.known === 0 && modeStats.read.unknown === 0)
  }

  loadCategories() {
    let counter = 0;
    return new Promise((resolve) => {
      DS.getCategoryList(this.id).then((categories) => {
        categories.forEach((cat) => {
          let category = new Category(cat.id, this.id, cat.name, cat.czechName, cat.icon);
          category.loadWordIds();
          category.loadStatistics().then(() => {if (++counter === categories.length) {resolve()}});
          this.categoryGroup.push(category);
        });
      });
    });
  }
}
