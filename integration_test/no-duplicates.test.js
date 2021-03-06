const { Client } = require('@elastic/elasticsearch');
const { deleteIndex } = require('./delete');
const { seed } = require('./seed');
const { getAllDuplicates } = require('../src/index');

const client = new Client({ node: 'http://localhost:9200' });
const index = 'game-of-thrones-test-noduplicates';

beforeAll(() => {
  return seed(client, index);
});

afterAll(() => {
  return deleteIndex(client, index);
});

it('verify no duplicates', async () => {
  const duplicates = await getAllDuplicates(client, index, ['character', 'quote']);
  expect(duplicates).toStrictEqual({});
});
