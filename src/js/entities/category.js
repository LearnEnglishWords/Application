import WordsStorage from '../storages/words.js';
import Statistics from './statistics.js';
import { statisticsData, trainingModeStatisticsData, allKnownWordsData } from '../store.js';
import { trainingModes } from '../utils.js';


export default class Category {
  constructor(id, collectionId, name, title, icon) {
    this.id = id;
    this.collectionId = collectionId;
    this.name = name;
    this.title = title;
    this.icon = icon;
    this.active = false;
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

