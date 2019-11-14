const { seed } = require("./seed");
const { deleteIndex } = require("./delete");
const { Client } = require("@elastic/elasticsearch");
const { getAllDuplicates } = require("../src/index");

const client = new Client({ node: "http://localhost:9200" });
const index = "game-of-thrones-test-duplicates";

beforeAll(() => {
  return seed(client, index);
});

afterAll(() => {
  return deleteIndex(client, index);
});

it("double seed", async () => {
  await seed(client, index);
  const duplicates = await getAllDuplicates(client, index, [
    "character",
    "quote"
  ]);
  Object.values(duplicates).forEach(value => {
    expect(value.length).toStrictEqual(2);
  });
});

it("triple seed", async () => {
  await seed(client, index);
  const duplicates = await getAllDuplicates(client, index, [
    "character",
    "quote"
  ]);
  Object.values(duplicates).forEach(value => {
    expect(value.length).toStrictEqual(3);
  });
});
