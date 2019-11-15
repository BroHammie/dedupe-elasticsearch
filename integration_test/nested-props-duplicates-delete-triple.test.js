const { seedNested } = require('./seed');
const { deleteIndex } = require('./delete');
const { Client } = require('@elastic/elasticsearch');
const { getAllDuplicates, findDeleteDuplicates } = require('../src/index');

const client = new Client({ node: 'http://localhost:9200' });
const keysToIncludeInHash = ['character.firstName', 'quote'];
const tripleIndex = 'game-of-thrones-test-nested-props-triple';

afterAll(() => {
  return Promise.all([
    deleteIndex(client, tripleIndex),
  ]);
});

it('triple seed', async () => {
  await seedNested(client, tripleIndex);
  await seedNested(client, tripleIndex);
  await seedNested(client, tripleIndex);
  const duplicates = await getAllDuplicates(client, tripleIndex, keysToIncludeInHash);
  expect(duplicates).not.toStrictEqual({});
  Object.values(duplicates).forEach(value => {
    expect(value.length).toStrictEqual(3);
  });

  const deleteResponse = await findDeleteDuplicates(client, tripleIndex, keysToIncludeInHash);
  expect(deleteResponse.statusCode).toStrictEqual(200);
  expect(deleteResponse.body.errors).toStrictEqual(false);

  const postDeleteDuplicates = await getAllDuplicates(client, tripleIndex, keysToIncludeInHash);
  expect(postDeleteDuplicates).toStrictEqual({});
});
