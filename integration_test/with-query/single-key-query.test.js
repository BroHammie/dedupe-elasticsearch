const { seedNested } = require('../seed');
const { deleteIndex } = require('../delete');
const { Client } = require('@elastic/elasticsearch');
const { getAllDuplicates } = require('../../src/index');

const client = new Client({ node: 'http://localhost:9200' });
const doubleIndex = 'game-of-thrones-test-single-query';

afterAll(() => {
  return Promise.all([deleteIndex(client, doubleIndex)]);
});

// lets double seed all, then triple seed one and then delete duplicates on that one, query and make sure we still have some duplicates
it(`only get Tyrion duplicates`, async () => {
  await seedNested(client, doubleIndex);
  await seedNested(client, doubleIndex);

  const tyrionQuery = {
    version: true,
    size: 10000,
    query: {
      bool: {
        should: [
          {
            match_phrase: {
              'character.firstName': 'Tyrion',
            },
          },
        ],
        minimum_should_match: 1,
      },
    },
  };

  // Count key = 1 firstName = Tyrion
  const duplicates = await getAllDuplicates(client, doubleIndex, ['character.firstName', 'quote'], tyrionQuery);
  expect(Object.keys(duplicates).length).toStrictEqual(1);
});
