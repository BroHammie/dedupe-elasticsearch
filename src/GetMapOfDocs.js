const { getHash } = require('./BuildHash');

// If the hash is new, then we will create a new key
// in the dict_of_duplicate_docs, which will be
// assigned a value of an empty array.
// We then immediately push the _id onto the array.
// If hash already exists, then
// we will just push the new _id onto the existing array
const populateMap = (keysToIncludeInHash = [], hits = [], existingMap = {}) => {
  return hits.reduce((accumulator, hit) => {
    const { _id } = hit;
    const hash = getHash(keysToIncludeInHash, hit);

    if (accumulator[hash]) {
      accumulator[hash].push(_id);
      return accumulator;
    }
    accumulator[hash] = [_id];
    return accumulator;
  }, existingMap);
};

module.exports = {
  populateMap,
};
