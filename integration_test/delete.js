const deleteIndex = (client, index) => {
  return client.indices.delete({
    index,
  });
};

module.exports = {
  deleteIndex,
};
