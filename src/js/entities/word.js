import { _ } from 'svelte-i18n';
import { get } from 'svelte/store';
import DS from '../storages/data.js';
import { WordsType, Modes } from '../utils.js'


export default class Word {
  constructor(text, pronunciation, state, sense, examples) {
    this.text = name;
    this.pronunciation = pronunciation;
    this.state = state;
    this.sense = sense;
    this.examples = examples;
  }
}
