import { Utils } from '../src/helpers/utils';
import { unaccent } from '../src/utils/unaccent';

test('unaccent string', () => {
  expect(unaccent('xin chào')).toBe('xin chao');
});

describe('Utils class unit test', () => {
  let utils: Utils;

  beforeAll(() => (utils = new Utils()));

  test('Create element div', () => {
    expect(utils.createElement(document, 'div', 'hello world').outerHTML).toEqual(
      '<div>hello world</div>'
    );
  });

  test('Create element div with class', () => {
    expect(utils.createElement(document, 'div', 'hello world', 'hello world').outerHTML).toEqual(
      '<div class="hello world">hello world</div>'
    );
  });

  test('Create element div child element', () => {
    const span = document.createElement('span');
    expect(utils.createElement(document, 'div', span, 'hello world').outerHTML).toEqual(
      '<div class="hello world"><span></span></div>'
    );
  });
});
