import WordsStorage from '../storages/words.js';
import Statistics from './statistics.js';
import { statisticsData, trainingModeStatisticsData } from '../store.js';


export default class Category {
  constructor(id, collectionId, name, title) {
    this.id = id;
    this.collectionId = collectionId;
    this.name = name;
    this.title = title;
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
    Object.values(this.wordStorages).forEach((wordsStorage) => {
      wordsStorage.loadIds(false)
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
  }
}

