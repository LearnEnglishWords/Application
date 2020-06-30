import WordsStorage from '../storages/words.js';
import DS from '../storages/data.js';
//import Statistics from './statistics.js';
import { statisticsData } from '../store.js';
import { KnownStages, WordsType, isKnown } from '../utils.js';


export default class Category {
  constructor(id, collectionId, name, title, icon) {
    this.id = id;
    this.collectionId = collectionId;
    this.name = name;
    this.title = title;
    this.icon = icon;
    this.active = false;
    this.wordStorages = {
      'all': new WordsStorage(collectionId, id, WordsType.ALL, 100),
      //'read': new WordsStorage(collectionId, id, 'read', 100),
      //'write': new WordsStorage(collectionId, id, 'write', 100),
      //'listen': new WordsStorage(collectionId, id, 'listen', 100),
      'known': new WordsStorage(collectionId, id, WordsType.KNOWN, 100),
      'learning': new WordsStorage(collectionId, id, WordsType.LEARNING, 100),
      'unknown': new WordsStorage(collectionId, id, WordsType.UNKNOWN, 100)
    };
    this.statistics = null;
  }

  loadWordIds() {
    this.wordStorages[WordsType.ALL].loadIds(false);
    this.wordStorages[WordsType.KNOWN].loadIds(false);
    this.wordStorages[WordsType.LEARNING].loadIds(false);
    this.wordStorages[WordsType.UNKNOWN].loadIds(false);
    //trainingModes.forEach((mode) => {
    //  this.wordStorages[mode.value].loadIds(false);
    //});
  }

  loadWords(type) {
    this.wordStorages[type].loadWords();
  }

  loadStatistics() {
    return new Promise((resolve) => {
      DS.getCategoryStatistics(this.collectionId, this.categoryId).then((stats) => {
        this.statistics = stats;
        resolve()
      });
    });
  }

  updateStatistics(word) {
    if (!this.wordStorages['all'].getWordIds().includes(word.text)) { return }

    if (isKnown(word)) {
      this.statistics.known += 1;
      this.statistics.learning -= 1;
      statisticsData.updateData();

      DS.saveCategoryStatistics(this.collectionId, this.id, this.statistics);
    }
  }

  //updateWords(mode, addWords, removeWords) {
  //  this.wordStorages[mode].update(addWords, removeWords);
  //  allKnownWordsData.updateData(mode, removeWords, []);
  //  allNotKnownWordsData.updateData(mode, addWords, removeWords);
  //}

  updateKnownWordList(word) {
    if (word.knownStage === KnownStages.UNKNOWN || word.knownStage === KnownStages.NOT_KNOWN) {
      this.wordStorages['known'].removeWord(word);
    } else if (word.knownStage <= KnownStages.HARD_KNOWN) {
      this.wordStorages['known'].addWord(word);
    } else {
      this.wordStorages['known'].removeWord(word);
    }
  }
}

