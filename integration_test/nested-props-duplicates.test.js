const { seedNested } = require("./seed");
const { deleteIndex } = require("./delete");
const { Client } = require("@elastic/elasticsearch");
const { getAllDuplicates } = require("../src/index");

const client = new Client({ node: "http://localhost:9200" });
const doubleIndex = "game-of-thrones-test-nested-props-duplicates-double";
const tripleIndex = "game-of-thrones-test-nested-props-duplicates-triple";
const quadrupleIndex = "game-of-thrones-test-nested-props-duplicates-quadruple";

afterAll(() => {

  return Promise.all([deleteIndex(client, doubleIndex), deleteIndex(client, tripleIndex), deleteIndex(client, quadrupleIndex)]);
});

it("double seed", async () => {

  await seedNested(client, doubleIndex);
  await seedNested(client, doubleIndex);
  const duplicates = await getAllDuplicates(client, doubleIndex, [
    "character.firstName",
    "quote"
  ]);

  Object.values(duplicates).forEach(value => {
    expect(value.length).toStrictEqual(2);
  });
});

it("3 seed", async () => {
  await seedNested(client, tripleIndex);
  await seedNested(client, tripleIndex);
  await seedNested(client, tripleIndex);
  const duplicates = await getAllDuplicates(client, tripleIndex, [
    "character.firstName",
    "quote"
  ]);
  Object.values(duplicates).forEach(value => {
    expect(value.length).toStrictEqual(3);
  });
});

it("4 seed", async () => {
  await seedNested(client, quadrupleIndex);
  await seedNested(client, quadrupleIndex);
  await seedNested(client, quadrupleIndex);
  await seedNested(client, quadrupleIndex);
  const duplicates = await getAllDuplicates(client, quadrupleIndex, [
    "character.firstName",
    "quote"
  ]);

  Object.values(duplicates).forEach(value => {
    expect(value.length).toStrictEqual(4);
  });

});

