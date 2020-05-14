import { get } from 'svelte/store';
import WordsStorage from '../storages/words.js';
import Statistics from './statistics.js';
import { statisticsData, trainingModeStatisticsData, allKnownWordsData } from '../store.js';
import { trainingModes } from '../utils.js';


export default class Category {
  constructor(id, collectionId, name, title) {
    this.id = id;
    this.collectionId = collectionId;
    this.name = name;
    this.title = title;
    this.active = true;
    this.wordStorages = {
      'all': new WordsStorage(collectionId, id, 'all', 100),
      'read': new WordsStorage(collectionId, id, 'read', 100),
      'write': new WordsStorage(collectionId, id, 'write', 100),
      'listen': new WordsStorage(collectionId, id, 'listen', 100),
    };
    this.statistics = new Statistics(this.collectionId, this.id);
  }

  loadWordIds() {
    this.wordStorages['all'].loadIds(false);
    trainingModes.forEach((mode) => {
      this.wordStorages[mode.value].loadIds(false);
    });
  }

  loadWords(type) {
    this.wordStorages[type].loadWords();
  }

  loadStatistics() {
    return this.statistics.load();
  }

  updateKnownWords() {
    let tmpWordIds = { "all": [], "read": [], "write": [], "listen": [] };
    for (let mode of trainingModes) {
      let wordStorage = this.wordStorages[mode.value];
      let allKnownWordIds = get(allKnownWordsData)[mode.value]
      for (let wordId of allKnownWordIds) {
        if (wordStorage.allWordIds.includes(wordId)) {
          tmpWordIds[mode.value].push(wordId);
        }
      }
    }
    for (let wordId of tmpWordIds["read"]) {
      if (tmpWordIds["write"].includes(wordId) && tmpWordIds["listen"].includes(wordId)) {
        tmpWordIds["all"].push(wordId);
      }
    }
    for (let mode of trainingModes) {
      this.wordStorages[mode.value].update([], tmpWordIds[mode.value]);
      tmpWordIds[mode.value] = tmpWordIds[mode.value].filter((wordId) => !tmpWordIds["all"].includes(wordId));
    }
    this.statistics.updateWithGroup(tmpWordIds);
  }

  updateStatistics(word, prevLearningState) {
    if (!this.wordStorages['all'].getWordIds().includes(word.text)) { return }
    this.statistics.update(word, prevLearningState);
    statisticsData.updateData();
    trainingModeStatisticsData.updateData();
  }

  updateWords(mode, addWords, removeWords) {
    this.wordStorages[mode].update(addWords, removeWords);
    allKnownWordsData.updateData(mode, removeWords, addWords);
  }
}

