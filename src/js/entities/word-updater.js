import { get } from 'svelte/store';
import DS from '../storages/data.js';
import { categoryDetailData, categoryGroupData, allKnownWordsData, allNotKnownWordsData } from '../store.js';
import { WordsType, trainingModes } from '../utils.js';


function getCurrentCategory() {
  var currentCategory = get(categoryGroupData)
  if (currentCategory === null) { 
    currentCategory = get(categoryDetailData);
  }
  return currentCategory
}


export default class WordUpdater {
  static update(word, prevLearningState) {
    var currentCategory = getCurrentCategory();
    currentCategory.updateStatistics(word, prevLearningState);

    return DS.saveWord(word.text, word);
  }

  static updateLearningWords(category) {
    return new Promise((resolve) => {
      let learningWords = new LearningWordsUpdater(category);
      learningWords.load();
      learningWords.update(WordsType.KNOWN).then(() => {
        learningWords.update(WordsType.NOT_KNOWN).then(resolve)
      });
    });
  }
}


export class LearningWordsUpdater {
  constructor(category) {
    this.words = {}; 
    this.words[WordsType.KNOWN] = { "all": [], "read": [], "write": [], "listen": [] };
    this.words[WordsType.NOT_KNOWN] = { "all": [], "read": [], "write": [], "listen": [] };
    this.category = category;
  }


  load() {
    for (let mode of trainingModes) {
      this.words[WordsType.KNOWN][mode.value] = this._getAllLearningWords(WordsType.KNOWN, mode.value);
      this.words[WordsType.NOT_KNOWN][mode.value] = this._getAllLearningWords(WordsType.NOT_KNOWN, mode.value);
    }
    this._reformatLearningWordsData(this.words[WordsType.KNOWN]);
    this._reformatLearningWordsData(this.words[WordsType.NOT_KNOWN]);
  }

  _reformatLearningWordsData(wordsData) {
    for (let wordId of wordsData["read"]) {
      if (wordsData["write"].includes(wordId) && wordsData["listen"].includes(wordId)) {
        wordsData["all"].push(wordId);
      }
    }

    for (let mode of trainingModes) {
      wordsData[mode.value] = wordsData[mode.value].filter((wordId) => !wordsData["all"].includes(wordId));
    }
  }

  _getAllLearningWords(type, mode) {
    let tmpWordIds = [];
    let allLearningWordIds = []
    let wordStorage;

    switch(type) {
      case WordsType.KNOWN: 
        allLearningWordIds = get(allKnownWordsData)[mode]
        wordStorage = this.category.wordStorages[mode]
        break;
      case WordsType.NOT_KNOWN: 
        allLearningWordIds = get(allNotKnownWordsData)[mode]
        wordStorage = this.category.wordStorages['all']
        break;
    }

    for (let wordId of allLearningWordIds) {
      if (wordStorage.getWordIds().includes(wordId)) {
        tmpWordIds.push(wordId);
      }
    }
    return tmpWordIds
  }

  _updateWordsInStorage(mode, type) {
    let allModeWordIds = this.words[type][mode].concat(this.words[type]["all"]);
    let addAllModeWordIds = [];
    let removeAllModeWordIds = [];
    if (type === WordsType.NOT_KNOWN) {
      addAllModeWordIds = allModeWordIds;
    } else {
      removeAllModeWordIds = allModeWordIds;
    }
    this.category.wordStorages[mode].update(addAllModeWordIds, removeAllModeWordIds, false);
  }

  update(type) {
    return new Promise((resolve) => {
      this.category.statistics.updateLearningWords(type, this.category.wordStorages, this.words[type]).then(() => {
        for (let mode of trainingModes) {
          this._updateWordsInStorage(mode.value, type);
        }
        resolve();
      });
    });
  }
}
