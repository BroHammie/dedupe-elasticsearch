const md5 = require("js-md5");

const getHash = (keyNames = [], hit) => {
  return md5(
    keyNames
      .map(key => {
        return hit._source[key];
      })
      .toString()
      .replace(/,/g, ""),
  );
};

module.exports = {
  getHash,
};
