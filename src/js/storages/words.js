import DS from './data.js';
import { KnownStages } from '../utils.js';


export default class WordsStorage {

  constructor(collectionId, categoryId, wordsType, maxAmount) { 
    this.wordsType = wordsType;

    this.collectionId = collectionId;
    this.categoryId = categoryId;

    this.loadedWordsCounter = 0;
    this.maxAmount = maxAmount;
        
    this.allWords = [];
    this.allWordIds = [];
  }

  saveWordIds() {
    DS.saveWordIdsList(this.collectionId, this.categoryId, this.allWordIds, this.wordsType);
  }

  setWordIds(ids) {
    this.allWordIds = ids;
  }

  getWordIds() {
    return this.allWordIds
  }

  loadIds(withWords, withoutIds = []) {
    DS.getWordIdsList(this.collectionId, this.categoryId, this.wordsType).then((wordIds) => {
      if (wordIds !== null) {
        this.allWordIds = wordIds.filter((wordId) => !withoutIds.includes(wordId));
        if(withWords) {
          this.loadWords();
        }
      }
    });
  }

  loadWords(from = 0, to = this.maxAmount) {
    this.allWordIds.slice(from, to).forEach((wordId) => {
      DS.getWord(wordId).then((word) => {
        if (this._getWordIndex(word) === null && (word.knownStage <= KnownStages.HARD_KNOWN || word.knownStage === undefined)) {
          this._pushWord(word);
        }
      });
    });
  }

  isLoaded(amount) {
    //alert(JSON.stringify(`${this.loadedWordsCounter} === ${this.allWordIds.length} || ${this.loadedWordsCounter} >= ${amount}`, null, 2))
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

  update(addWords, removeWords, loadWords = true) {
    var updateWordIds = this.allWordIds
      .concat(addWords)
      .filter(wordId => !removeWords.includes(wordId));

    this.reset();
    this.allWordIds = [...new Set(updateWordIds)];
    this.allWords = [];
    if (loadWords) { 
      this.loadWords()
    }
    this.saveWordIds();
  }

  _pushWordId(wordId) {
    let index = this.allWordIds.findIndex((id) => id === wordId);
    if (index === -1) { 
      this.allWordIds.push(wordId) 
      DS.saveWordIdsList(this.collectionId, this.categoryId, this.allWordIds, this.wordsType);
    }
  }

  _pullWordId(wordId) {
    let index = this.allWordIds.findIndex((id) => id === wordId);
    if (index > -1) { 
      this.allWordIds.splice(index, 1) 
      DS.saveWordIdsList(this.collectionId, this.categoryId, this.allWordIds, this.wordsType);
    }
  }

  _pushWord(word) {
    let index = this._getWordIndex(word);
    if (index === null) { 
      this.allWords.push(word);
      this.loadedWordsCounter++;
    }
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

