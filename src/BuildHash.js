const md5 = require('js-md5');

const getDescendantProp = (obj, path) => path.split('.').reduce((acc, part) => acc && acc[part], obj);

const getHash = (keyNames = [], hit) => {
  return md5(
    keyNames
      .map(key => {
        return getDescendantProp(hit._source, key);
      })
      .toString()
      .replace(/,/g, ''),
  );
};

module.exports = {
  getHash,
  getDescendantProp,
};
