[![CircleCI](https://circleci.com/gh/BroHammie/dedupe-elasticsearch/tree/master.svg?style=svg)](https://circleci.com/gh/BroHammie/dedupe-elasticsearch/tree/master)
# dedupe-elasticsearch
JS version of https://github.com/alexander-marquardt/deduplicate-elasticsearch

Use <b>WITH EXTREME CAUTION </b>like:
```
const { getAllDuplicates, deleteAllDuplicates } = require('./dedupe-elasticsearch');

const localClient = new Client({ node: 'http://localhost:9200' });
const indexName = 'node-test5';

// Returns map of {hashKey: [esId1, esId2, esId3], hashKey2: [esId4, esId5]}
const duplicates = await getAllDuplicates(localClient, indexName, ["character", "quote"]);

// Returns an esClient.bulk response 
const deleteResponse = await deleteAllDuplicates(localClient, indexName, ["character", "quote"]);

```