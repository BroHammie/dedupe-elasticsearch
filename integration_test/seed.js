const seed = (client, index) => {
  return client.bulk({
    // here we are forcing an index refresh,
    // otherwise we will not get any result
    // in the consequent search
    refresh: true,
    body: [
      // operation to perform
      { index: { _index: index } },
      // the document to index
      {
        character: "Ned Stark",
        quote: "Winter is coming."
      },

      { index: { _index: index } },
      {
        character: "Daenerys Targaryen",
        quote: "I am the blood of the dragon."
      },

      { index: { _index: index } },
      {
        character: 'Tyrion Lannister',
        quote: 'A mind needs books like a sword needs a whetstone.'
      },
    ],
  });
};

const seedNested = (client, index) => {
  return client.bulk({
    // here we are forcing an index refresh,
    // otherwise we will not get any result
    // in the consequent search
    refresh: true,
    body: [
      // operation to perform
      { index: { _index: index } },
      // the document to index
      {
        "character": {
          "firstName": 'Ned',
          "lastName": 'Stark'
        },
        quote: 'Winter is coming.'
      },
      { index: { _index: index } },
      {
        "character": {
          "firstName": 'Daenerys',
          "lastName": 'Targaryen'
        },
        quote: 'I am the blood of the dragon.'
      },
      { index: { _index: index } },
      {
        "character": {
          "firstName": 'Tyrion',
          "lastName": 'Lannister'
        },
        quote: 'A mind needs books like a sword needs a whetstone.'
      },
    ],
  });
};

module.exports = {
  seed,
  seedNested,
};
