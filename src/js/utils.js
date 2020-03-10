
export const defaultStatisticsData = {
  "count": 100,
  "known": 0,
  "learning": 0,
  "unknown": 100
};


export function isKnownForMode(word, mode) { 
  if (word.learning === undefined) { return false }
  if (word.learning[mode] === false) { return false } else { return true }
}

export function isKnown(word) {
  if (word.learning === undefined) { return false }
  if (word.learning.read === false && word.learning.write === false && word.learning.listen === false) {
    return false
  } else {
    return true
  }
}                   

export function getState(word) {
  if (word.learning === undefined || (word.learning.read === false && word.learning.write === false && word.learning.listen === false)) {
    return "unknown"
  } else if (word.learning.read !== false && word.learning.write !== false && word.learning.listen !== false) {
    return "known"
  } else {
    return "learning"
  }
}
