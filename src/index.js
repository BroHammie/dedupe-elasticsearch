const { scrollAllDocs } = require('./ScrollAllDocs');

/**
 *
 * @param esClient
 * @param index
 * @param keysToIncludeInHash = String array of keys to make hashmap from
 * @param queryJson = ES json query string to limit the duplicates to check for
 * @returns {Promise<{}|{[p: string]: *}>
 *   duplicates {hashKey: [esId1, esId2, esId3], hashKey2: [esId4, esId5]}}
 */
const getAllDuplicates = async (esClient, index, keysToIncludeInHash, queryJson = {}) => {
  const allDocs = await scrollAllDocs(esClient, index, keysToIncludeInHash, queryJson);

  // Only keep records with more than one id
  return Object.keys(allDocs)
    .filter(hashKey => {
      return allDocs[hashKey].length > 1;
    })
    .reduce(
      (onlyDuplicates, key) => ({
        ...onlyDuplicates,
        [key]: allDocs[key],
      }),
      {},
    );
};

// Returns bulk delete promise, duplicates is the result from getAllDuplicates
const deleteAllDuplicates = async (esClient, index, duplicates) => {
  if (Object.keys(duplicates).length > 0) {
    // duplicates is map of array
    const deleteString = Object.values(duplicates)
      .map(arrayOfIds => arrayOfIds.slice(1))
      .flat()
      .reduce(
        (deleteAccum, nextId) => `${deleteAccum} { "delete": { "_index": "${index}", "_id": "${nextId}" } },\n`,
        '',
      );
    return esClient.bulk({
      // here we are forcing an index refresh,
      // otherwise we will not get any result
      // in the consequent search
      refresh: true,
      body: `${deleteString}`,
    });
  }
  return {};
};

// Returns bulk delete promise
const findDeleteDuplicates = async (esClient, index, keysToIncludeInHash, jsonQuery) => {
  const duplicates = await getAllDuplicates(esClient, index, keysToIncludeInHash, jsonQuery);
  return deleteAllDuplicates(esClient, index, duplicates);
};

module.exports = {
  getAllDuplicates,
  deleteAllDuplicates,
  findDeleteDuplicates,
};
