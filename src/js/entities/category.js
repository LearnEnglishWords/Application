import WordsStorage from '../storages/words.js';
import DS from '../storages/data.js';
import { WordsType, LearningMode, KnownStages, isKnown, isAlreadyKnown, setupLearning, setupRepetition } from '../utils.js';


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
      'already_known': new WordsStorage(collectionId, id, WordsType.ALREADY_KNOWN, 100),
      'known': new WordsStorage(collectionId, id, WordsType.KNOWN, 100),
      'learning': new WordsStorage(collectionId, id, WordsType.LEARNING, 100),
      'unknown': new WordsStorage(collectionId, id, WordsType.UNKNOWN, 100)
    };
  }

  loadWordIds() {
    this.wordStorages[WordsType.ALREADY_KNOWN].loadIds(false);
    this.wordStorages[WordsType.KNOWN].loadIds(false);
    this.wordStorages[WordsType.LEARNING].loadIds(true);
    this.wordStorages[WordsType.UNKNOWN].loadIds(false);
    this.wordStorages[WordsType.ALL].loadIds(false);
  }

  isLoaded() {
    return this.wordStorages[WordsType.ALL].allWordIds.length > 0 
  }

  loadWords(type) {
    this.wordStorages[type].loadWords();
  }

  updateWord(word, state, trainingType, trainingMode) {
    if (!this.wordStorages[WordsType.ALL].existsWordId(word.text)) { return }

    switch(trainingType) {
      case LearningMode.EXAM:
        word.learning[trainingMode] = state;
        if(isKnown(word)) {
          word.knownStage = KnownStages.KNOWN;
          word.knownDate = Date.now();
          this.wordStorages[WordsType.LEARNING].removeWord(word);
          this.wordStorages[WordsType.KNOWN].addWord(word);
        }
        break;
      case LearningMode.REPETITION:
        if (!state) {
          word.knownStage = KnownStages.UNKNOWN;
          word.learning[trainingMode] = false;
          setupRepetition(word, false);
          word.problem = true;
          this.wordStorages[WordsType.LEARNING].addWord(word);
          this.wordStorages[WordsType.KNOWN].removeWord(word);
        } else {
          word.repetition[trainingMode] = true;
          if(isAlreadyKnown(word)) {
            word.knownStage = KnownStages.ALREADY_KNOWN;
            this.wordStorages[WordsType.ALREADY_KNOWN].addWord(word);
            this.wordStorages[WordsType.KNOWN].removeWord(word);
          }
        }
        break;
      case LearningMode.FILTER:
        if (state === null) {
          this.wordStorages[WordsType.LEARNING].addWord(word);
          word.knownStage = KnownStages.LITTLE_KNOWN;
          setupLearning(word, false);
          setupRepetition(word, false);
        } else if (state) {
          this.wordStorages[WordsType.ALREADY_KNOWN].addWord(word);
          word.knownStage = KnownStages.ALREADY_KNOWN;
          setupLearning(word, true);
          setupRepetition(word, true);
        } else {
          this.wordStorages[WordsType.LEARNING].insertWord(word);
          word.knownStage = KnownStages.UNKNOWN;
          setupLearning(word, false);
          setupRepetition(word, false);
        }

        word.problem = false;
        this.wordStorages[WordsType.UNKNOWN].removeWord(word);
        break;
    } 
    DS.saveWord(word.text, word);
  }

  updateWordList(wordList, setAs, progress) {
    if (setAs === WordsType.ALREADY_KNOWN) {
      wordList.forEach((word) => {
        if (this.wordStorages[WordsType.ALL].existsWordId(word.text)) { 
          this.wordStorages[WordsType.ALREADY_KNOWN].addWord(word);
          word.knownStage = KnownStages.ALREADY_KNOWN;
          setupLearning(word, true);
          setupRepetition(word, true);

          this.wordStorages[WordsType.UNKNOWN].removeWord(word);
          this.wordStorages[WordsType.KNOWN].removeWord(word);
          this.wordStorages[WordsType.LEARNING].removeWord(word);

          DS.saveWord(word.text, word).then(progress);
        }
      });
    } else if (setAs === WordsType.UNKNOWN) {
      wordList.forEach((word) => {
        if (this.wordStorages[WordsType.ALL].existsWordId(word.text)) { 
          this.wordStorages[WordsType.UNKNOWN].insertWord(word);
          word.knownStage = KnownStages.UNKNOWN;
          setupLearning(word, false);
          setupRepetition(word, false);

          this.wordStorages[WordsType.ALREADY_KNOWN].removeWord(word);
          this.wordStorages[WordsType.KNOWN].removeWord(word);
          this.wordStorages[WordsType.LEARNING].removeWord(word);

          DS.saveWord(word.text, word).then(progress);
        }
      });
    } else if (setAs === WordsType.LEARNING) {
      wordList.forEach((word) => {
        if (this.wordStorages[WordsType.ALL].existsWordId(word.text)) { 
          this.wordStorages[WordsType.LEARNING].insertWord(word);
          word.knownStage = KnownStages.UNKNOWN;
          setupLearning(word, false);
          setupRepetition(word, false);

          this.wordStorages[WordsType.ALREADY_KNOWN].removeWord(word);
          this.wordStorages[WordsType.KNOWN].removeWord(word);
          this.wordStorages[WordsType.UNKNOWN].removeWord(word);

          DS.saveWord(word.text, word).then(progress);
        }
      });
    }
  }

  getWordState(word) {
    if (!this.wordStorages[WordsType.ALL].existsWordId(word.text)) { return null }

    for (let wordType of [WordsType.LEARNING, WordsType.UNKNOWN, WordsType.ALREADY_KNOWN, WordsType.KNOWN]) {
      if (this.wordStorages[wordType].existsWordId(word.text)) { return wordType }
    }
  }

  getStatistic(wordType) {
    return this.wordStorages[wordType].getWordIds().length
  }

  getStatistics() {
    return {
      "count": this.wordStorages[WordsType.ALL].getWordIds().length,
      "alreadyKnown": this.wordStorages[WordsType.ALREADY_KNOWN].getWordIds().length,
      "known": this.wordStorages[WordsType.KNOWN].getWordIds().length + this.wordStorages[WordsType.ALREADY_KNOWN].getWordIds().length,
      "learning": this.wordStorages[WordsType.LEARNING].getWordIds().length,
      "unknown": this.wordStorages[WordsType.UNKNOWN].getWordIds().length
    };
  }

  getModeStatistics() {
    let learningCount = this.wordStorages[WordsType.LEARNING].getWordIds().length;
    let words = this.wordStorages[WordsType.LEARNING].getWords(learningCount);
    if (learningCount !== words.length) { return null }

    let getKnownWordsCount = (mode) => { 
      return words.filter((word) => word.learning !== undefined && word.learning[mode] !== false).length 
    }

    return {
      "read": { "known": getKnownWordsCount("read"), "unknown": learningCount },
      "write": { "known": getKnownWordsCount("write"), "unknown": learningCount },
      "listen": { "known": getKnownWordsCount("listen"), "unknown": learningCount },
    }
  }

  addWord(word) {
    if (!this.wordStorages[WordsType.ALL].contain(word.text)) {
      this.wordStorages[WordsType.ALL].addWord(word);
      if (isAlreadyKnown(word)) {
        this.wordStorages[WordsType.ALREADY_KNOWN].addWord(word);
      } else if (isKnown(word)) {
        this.wordStorages[WordsType.KNOWN].addWord(word);
      } else {
        this.wordStorages[WordsType.UNKNOWN].addWord(word);
      }
    }
  }

  removeWord(word) {
    Object.values(this.wordStorages).forEach((wordStorage) => {
      wordStorage.removeWord(word);
    });
  }
}

