const { scrollAllDocs } = require('./ScrollAllDocs');

// Returns the duplicates {hashKey: [esId1, esId2, esId3], hashKey2: [esId4, esId5]}
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

// Returns bulk delete promise
const deleteAllDuplicates = async (esClient, index, duplicates) => {
  // duplicates is array of array
  const deleteString = Object.values(duplicates)
    .map(arrayOfIds => arrayOfIds.slice(1))
    .flat()
    .reduce(
      (deleteAccum, nextId) =>
        `${deleteAccum} { "delete": { "_index": "${index}", "_id": "${nextId}" } },\n`,
      '',
    );

  return esClient.bulk({
    // here we are forcing an index refresh,
    // otherwise we will not get any result
    // in the consequent search
    refresh: true,
    body: `${deleteString}`,
  });
};

// Returns bulk delete promise
const findDeleteDuplicates = async (esClient, index, keysToIncludeInHash) => {
  const duplicates = await getAllDuplicates(esClient, index, keysToIncludeInHash);
  return deleteAllDuplicates(esClient, index, duplicates);
};

module.exports = {
  getAllDuplicates,
  deleteAllDuplicates,
  findDeleteDuplicates,
};
