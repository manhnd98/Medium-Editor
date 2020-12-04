import * as utils from './utils';
// @ponicode
describe('inst.isHTMLCollection', () => {
  let inst: utils.Utils;

  beforeEach(() => {
    inst = new utils.Utils();
  });

  test('0', () => {
    const result = inst.isHTMLCollection(undefined);
    expect(result).toBe(true);
  });
});
