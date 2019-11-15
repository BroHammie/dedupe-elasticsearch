const { seed } = require("./seed");
const { deleteIndex } = require("./delete");
const { Client } = require("@elastic/elasticsearch");
const { findDeleteDuplicates, getAllDuplicates } = require("../src/index");

const client = new Client({ node: "http://localhost:9200" });
const index = "game-of-thrones-test-delete-duplicates";

beforeAll(() => {
  return seed(client, index);
});

afterAll(() => {
  return deleteIndex(client, index);
});

it("delete double seed", async () => {
  await seed(client, index);
  const duplicates = await getAllDuplicates(client, index, [
    "character",
    "quote"
  ]);
  Object.values(duplicates).forEach(value => {
    expect(value.length).toStrictEqual(2);
  });

  const deleteResponse = await findDeleteDuplicates(client, index, [
    "character",
    "quote"
  ]);
  expect(deleteResponse.statusCode).toStrictEqual(200);
  expect(deleteResponse.body.errors).toStrictEqual(false);

  const postDuplicates = await getAllDuplicates(client, index, [
    "character",
    "quote"
  ]);
  expect(postDuplicates).toStrictEqual({});
});
