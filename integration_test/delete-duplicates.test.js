const { seed } = require("./seed");
const { deleteIndex } = require("./delete");
const { Client } = require("@elastic/elasticsearch");
const { deleteAllDuplicates, getAllDuplicates } = require("../dist/dedupe-elasticsearch");

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

  const deleteResponse = await deleteAllDuplicates(client, index, [
    "character",
    "quote"
  ]);

  expect(deleteResponse.statusCode).toStrictEqual(200);
  expect(deleteResponse.body.errors).toStrictEqual(false);

  //Timeout its not refreshing instantly
  setTimeout(async () => {
    const duplicates = await getAllDuplicates(client, index, [
      "character",
      "quote"
    ]);
    expect(duplicates).toStrictEqual({});
  }, 1000);
});
