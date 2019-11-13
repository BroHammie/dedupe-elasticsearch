const { scrollAllDocs } = require('./ScrollAllDocs');

const getAllDuplicates = async (esClient, index, keysToIncludeInHash) => {
  const allDocs = await scrollAllDocs(esClient, index, keysToIncludeInHash);

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

const deleteAllDuplicates = async (esClient, index, keysToIncludeInHash) => {
  const duplicates = await getAllDuplicates(esClient, index, keysToIncludeInHash);

  // duplicates is array of array
  const deleteString = Object.values(duplicates)
    .map(arrayOfIds => arrayOfIds.slice(1))
    .flat()
    .reduce((deleteAccum, nextId) => `{ "delete": { "_index": "${index}", "_id": "${nextId}" } },`, {});

  return esClient.bulk({
    // here we are forcing an index refresh,
    // otherwise we will not get any result
    // in the consequent search
    refresh: true,
    body: [deleteString],
  });
};

module.exports = {
  getAllDuplicates,
  deleteAllDuplicates,
};