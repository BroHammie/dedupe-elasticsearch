const { getDescendantProp, getHash } = require('./BuildHash');

it('getHash', () => {
  const result = getHash(['merchantId', 'deviceId'], {
    _source: {
      merchantId: 123,
      deviceId: 123,
    },
  });
  expect(result).toStrictEqual('4297f44b13955235245b2497399d7a93');
});

it('getDescendantProp', () => {
  const result = getDescendantProp({mdc: {id: 123}}, "mdc.id");
  expect(result).toStrictEqual(123);
});
