import DS from './data.js';
import { WordsType } from '../utils.js';


export default class WordsStorage {

  constructor(collectionId, categoryId, currentMode, maxAmount) { 
    this.currentMode = currentMode;

    this.collectionId = collectionId;
    this.categoryId = categoryId;

    this.loadedWordsCounter = 0;
    this.maxAmount = maxAmount;
        
    this.allWords = [];
    this.allWordIds = [];
  }

  saveWordIds() {
    DS.saveWordIdsList(this.collectionId, this.categoryId, this.allWordIds, WordsType.NOT_KNOWN, this.currentMode);
  }

  setWordIds(ids) {
    this.allWordIds = ids;
  }

  getWordIds() {
    return this.allWordIds
  }

  loadIds(withWords) {
    DS.getWordIdsList(this.collectionId, this.categoryId, WordsType.NOT_KNOWN, this.currentMode).then((wordIds) => {
      this.allWordIds = wordIds;
      if(withWords) {
        this.loadWords();
      }
    });
  }

  loadWords(from = 0, to = this.maxAmount) {
    this.allWordIds.slice(from, to).forEach((wordId) => {
      DS.getWord(wordId).then((word) => {
        if (this._getWordIndex(word) === null) {
          this._pushWord(word);
        }
      });
    });
  }

  isLoaded(amount) {
    return this.loadedWordsCounter === this.allWordIds.length || this.loadedWordsCounter >= amount
  }

  addWord(word) {
    this._pushWordId(word.text);
    this._pushWord(word);
  }

  removeWord(word) {
    this._pullWordId(word.text);
    this._pullWord(word);
  }
  
  getWords(limit) {
    if(this.loadedWordsCounter < this.maxAmount) {
      this.loadWords(this.loadedWordsCounter, this.maxAmount);
    }
    return this.allWords.slice(0, limit)
  }

  reset() {
    this.loadedWordsCounter = 0;
        
    this.allWords = [];
    this.allWordIds = [];
  }

  _pushWordId(wordId) {
    this.allWordIds.push(wordId);
    DS.saveWordIdsList(this.collectionId, this.categoryId, this.allWordIds, WordsType.NOT_KNOWN, this.currentMode);
  }

  _pullWordId(wordId) {
    let index = this.allWordIds.findIndex((id) => id === wordId);
    if (index > -1) { this.allWordIds.splice(index, 1) }
    DS.saveWordIdsList(this.collectionId, this.categoryId, this.allWordIds, WordsType.NOT_KNOWN, this.currentMode);
  }

  _pushWord(word) {
    this.allWords.push(word);
    this.loadedWordsCounter++;
  }

  _pullWord(word) {
    let index = this._getWordIndex(word);
    if (index !== null) { 
      this.allWords.splice(index, 1);
      this.loadedWordsCounter--;
    }
  }

  _getWordIndex(word) {
    let index = this.allWords.findIndex((w) => w.text === word.text);
    if (index > -1) { 
      return index
    } else {
      return null
    }
  }
}

