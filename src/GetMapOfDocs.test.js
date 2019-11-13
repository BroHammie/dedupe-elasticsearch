const { populateMap } = require("./GetMapOfDocs");
const { getHash } = require("./BuildHash");

it("all unique", () => {
  const keys = ["merchantId", "deviceId"];

  const hits = [
    {
 _id: 1, _source: {
 merchantId: 123, deviceId: 123, 
}, 
},
    {
 _id: 2, _source: {
 merchantId: 1234, deviceId: 1234, 
}, 
},
  ];
  const firstKey = getHash(keys, hits[0]);
  const secondKey = getHash(keys, hits[1]);

  const result = populateMap(["merchantId", "deviceId"], hits);

  const expectedResult = {
};
  expectedResult[firstKey] = [hits[0]._id];
  expectedResult[secondKey] = [hits[1]._id];

  expect(result).toStrictEqual(expectedResult);
});

it("one duplicate", () => {
  const keys = ["merchantId", "deviceId"];

  const hits = [
    {
 _id: 1, _source: {
 merchantId: 123, deviceId: 123, 
}, 
},
    {
 _id: 2, _source: {
 merchantId: 123, deviceId: 123, 
}, 
},
    {
 _id: 3, _source: {
 merchantId: 1234, deviceId: 1234, 
}, 
},
  ];
  const firstKey = getHash(keys, hits[0]);
  const thirdKey = getHash(keys, hits[2]);

  const result = populateMap(["merchantId", "deviceId"], hits);

  const expectedResult = {
};
  expectedResult[firstKey] = [hits[0]._id, hits[1]._id];
  expectedResult[thirdKey] = [hits[2]._id];

  expect(result).toStrictEqual(expectedResult);
});

it("two duplicates", () => {
  const keys = ["merchantId", "deviceId"];

  const hits = [
    {
 _id: 1, _source: {
 merchantId: 123, deviceId: 123, 
}, 
},
    {
 _id: 2, _source: {
 merchantId: 123, deviceId: 123, 
}, 
},
    {
 _id: 3, _source: {
 merchantId: 1234, deviceId: 1234, 
}, 
},
    {
 _id: 4, _source: {
 merchantId: 1234, deviceId: 1234, 
}, 
},
    {
 _id: 5, _source: {
 merchantId: 12345, deviceId: 12345, 
}, 
},
  ];
  const firstKey = getHash(keys, hits[0]);
  const thirdKey = getHash(keys, hits[2]);
  const fifthKey = getHash(keys, hits[4]);

  const result = populateMap(["merchantId", "deviceId"], hits);

  const expectedResult = {
};
  expectedResult[firstKey] = [hits[0]._id, hits[1]._id];
  expectedResult[thirdKey] = [hits[2]._id, hits[3]._id];
  expectedResult[fifthKey] = [hits[4]._id];

  expect(result).toStrictEqual(expectedResult);
});

it("two duplicates different batches", () => {
  const keys = ["merchantId", "deviceId"];

  const hits = [
    {
 _id: 1, _source: {
 merchantId: 123, deviceId: 123, 
}, 
},
    {
 _id: 2, _source: {
 merchantId: 123, deviceId: 123, 
}, 
},
    {
 _id: 3, _source: {
 merchantId: 1234, deviceId: 1234, 
}, 
},
    {
 _id: 4, _source: {
 merchantId: 1234, deviceId: 1234, 
}, 
},
    {
 _id: 5, _source: {
 merchantId: 12345, deviceId: 12345, 
}, 
},
  ];
  const firstKey = getHash(keys, hits[0]);
  const thirdKey = getHash(keys, hits[2]);
  const fifthKey = getHash(keys, hits[4]);

  const firstMap = populateMap(["merchantId", "deviceId"], hits);

  const secondHits = [{
 _id: 6, _source: {
 merchantId: 123, deviceId: 123, 
}, 
}];

  const secondResult = populateMap(
    ["merchantId", "deviceId"],
    secondHits,
    firstMap,
  );

  const thirdHits = [{
 _id: 7, _source: {
 merchantId: 123, deviceId: 123, 
}, 
}];

  const result = populateMap(
    ["merchantId", "deviceId"],
    thirdHits,
    secondResult,
  );

  const expectedResult = {
};
  expectedResult[firstKey] = [
    hits[0]._id,
    hits[1]._id,
    secondHits[0]._id,
    thirdHits[0]._id,
  ];
  expectedResult[thirdKey] = [hits[2]._id, hits[3]._id];
  expectedResult[fifthKey] = [hits[4]._id];

  expect(result).toStrictEqual(expectedResult);
});
