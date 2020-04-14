import { _ } from 'svelte-i18n';
import { get } from 'svelte/store';
import DS from '../storages/data.js';
import { WordsType, Modes } from '../utils.js'


export default class Category {
  constructor(id, name, title) {
    this.id = id;
    this.name = name;
    this.title = title;
    this.words = [];
  }
}

