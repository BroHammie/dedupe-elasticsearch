const { seedNested } = require('../seed');
const { deleteIndex } = require('../delete');
const { Client } = require('@elastic/elasticsearch');
const { getAllDuplicates, findDeleteDuplicates } = require('../../src/index');

const client = new Client({ node: 'http://localhost:9200' });
const doubleIndex = 'game-of-thrones-test-query-delete-duplicates-double';

afterAll(() => {
  return Promise.all([deleteIndex(client, doubleIndex)]);
});

// lets double seed all, then triple seed one and then delete duplicates on that one, query and make sure we still have some duplicates
it(`only delete Lannister doubles`, async () => {
  await seedNested(client, doubleIndex);
  await seedNested(client, doubleIndex);

  const lannisterQuery = {
    query: {
      bool: {
        should: [
          {
            match_phrase: {
              'character.lastName': 'Lannister',
            },
          },
        ],
        minimum_should_match: 1,
      },
    },
  };

  const tyrionQuery = {
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

  // Count duplicates lannister last name
  const duplicates = await getAllDuplicates(client, doubleIndex, ['character.firstName', 'quote'], lannisterQuery);
  Object.values(duplicates).forEach(value => {
    expect(value.length).toStrictEqual(2);
  });

  // Delete duplicates firstName = Tyrion
  const deleteResponse = await findDeleteDuplicates(client, doubleIndex, ['character.firstName', 'quote'], tyrionQuery);
  expect(deleteResponse.statusCode).toStrictEqual(200);
  expect(deleteResponse.body.errors).toStrictEqual(false);

  // Lannister has one duplicate Jaime
  const postDeleteDuplicates = await getAllDuplicates(client, doubleIndex, ['character.firstName', 'quote'], lannisterQuery);
  expect(Object.keys(postDeleteDuplicates).length).toStrictEqual(1);
  Object.values(postDeleteDuplicates).forEach(value => {
    expect(value.length).toStrictEqual(2);
  });

});
