import { writable } from 'svelte/store';
import { collectionData } from './store.js';
import untar from "js-untar";

export default class WordService {
  constructor() {
    return this;
  }

  async getWords() {
    const res = await fetch(`http://drakeman.cz/english-words.json`);
    var photos = await res.json();
    return photos
  }

  async downloadBasicCollection() {
    const res = await fetch('http://drakeman.cz/english-words/collections/basic.tar');
    var collection = await res.blob();

    const reader = new FileReader();
    reader.onload = function (event) {
      untar(reader.result).then(
        function (extractedFiles) { // onSuccess
          collectionData.set(extractedFiles); 
        },
        function (err) {
          onTarError('Untar Error', err);
        }
      )
    };

    reader.onerror = function (event) {
      console.log('FileReader Error', event);
      onTarError('FileReader Error', event);
    };

    reader.readAsArrayBuffer(collection);
  }
}
