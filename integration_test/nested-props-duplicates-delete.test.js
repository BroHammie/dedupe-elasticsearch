const { seedNested } = require('./seed');
const { deleteIndex } = require('./delete');
const { Client } = require('@elastic/elasticsearch');
const { getAllDuplicates, findDeleteDuplicates } = require('../src/index');

const client = new Client({ node: 'http://localhost:9200' });
const keysToIncludeInHash = ['character.firstName', 'quote'];
const doubleIndex = 'game-of-thrones-test-nested-props-double';

afterAll(() => {
  return Promise.all([
    deleteIndex(client, doubleIndex),
  ]);
});

it('double seed', async () => {
  await seedNested(client, doubleIndex);
  await seedNested(client, doubleIndex);
  const duplicates = await getAllDuplicates(client, doubleIndex, keysToIncludeInHash);
  expect(duplicates).not.toStrictEqual({});
  Object.values(duplicates).forEach(value => {
    expect(value.length).toStrictEqual(2);
  });

  const deleteResponse = await findDeleteDuplicates(client, doubleIndex, keysToIncludeInHash);
  expect(deleteResponse.statusCode).toStrictEqual(200);
  expect(deleteResponse.body.errors).toStrictEqual(false);

  const postDeleteDuplicates = await getAllDuplicates(client, doubleIndex, keysToIncludeInHash);
  expect(postDeleteDuplicates).toStrictEqual({});
});
