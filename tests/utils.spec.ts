import { unaccent } from '../src/utils/unaccent';

test('unaccent string', () => {
  expect(unaccent('xin chào')).toBe('xin chao');
});
