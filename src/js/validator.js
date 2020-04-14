import { WordsType, Modes } from './utils.js'

export default class Validator {

  static isMode(mode) {
    if (Object.values(Modes).includes(mode)) { return true }
    return false
  }

  static isWordsType(type) {
    if (Object.values(WordsType).includes(type)) { return true }
    return false
  }
}
