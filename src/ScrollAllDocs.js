const { populateMap } = require('./GetMapOfDocs');

// Loop over all documents in the index, and populate the
// map data structure.
const scrollAllDocs = async (esClient, index, keysToIncludeInHash = []) => {
  const data = await esClient.search({
    index,
    scroll: '1m',
    body: {
      query: {
        match_all: {},
      },
    },
  });
  const sid = data.body._scroll_id;
  let allDocsMap = {};
  if (data.body.hits) {
    let scrollSize = data.body.hits.hits.length;
    // # Before scroll, process current batch of hits
    allDocsMap = populateMap(keysToIncludeInHash, data.body.hits.hits);
    /* eslint no-await-in-loop: 0 */
    while (scrollSize > 0) {
      const nextData = await esClient.scroll({
        scrollId: sid,
        scroll: '2m',
      });
      allDocsMap = populateMap(keysToIncludeInHash, nextData.body.hits.hits, allDocsMap);
      scrollSize = nextData.body.hits.hits.length;
    }
  }

  return allDocsMap;
};

module.exports = {
  scrollAllDocs,
};
