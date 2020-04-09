
import Collection from './collection.js';
import { Modes, WordsType } from './utils.js';


export default class WordsStorage {

  constructor(currentMode, maxAmount) { 
    this.storage = new Collection();
    this.currentMode = currentMode;

    this.loadedWordsCounter = 0;
    this.maxAmount = maxAmount;
        
    this.allWords = [];
    this.allWordIds = [];
  }

  loadIds(collectionId, categoryId, withWords) {
    this.collectionId = collectionId;
    this.categoryId = categoryId;

    this.storage.getWordIdsListPromise(collectionId, categoryId, WordsType.NOT_KNOWN, this.currentMode).then((wordIds) => {
      this.allWordIds = wordIds;
      if(withWords) {
        this.loadWords(0, this.maxAmount, false);
      }
    });
  }

  loadWords(from, to, checkExists) {
    this.allWordIds.slice(from, to).forEach((wordId) => {
      this.storage.getWord(wordId, (word) => {
        if (checkExists) { 
          if (this._getWordIndex(word) === null) {
            this._pushWord(word);
          }
        } else {
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
      this.loadWords(this.loadedWordsCounter, this.maxAmount, true);
    }
    return this.allWords.slice(0, limit)
  }


  _pushWordId(wordId) {
    this.allWordIds.push(wordId);
    this.storage.saveWordIdsList(this.collectionId, this.categoryId, this.allWordIds, WordsType.NOT_KNOWN, this.currentMode);
  }

  _pullWordId(wordId) {
    let index = this.allWordIds.findIndex((id) => id === wordId);
    if (index > -1) { this.allWordIds.splice(index, 1) }
    this.storage.saveWordIdsList(this.collectionId, this.categoryId, this.allWordIds, WordsType.NOT_KNOWN, this.currentMode);
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
