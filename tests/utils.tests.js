import { expect } from 'chai';
import * as utils from '../src/utils';

describe('utils', () => {
  describe('flatten', () => {
    const flatten = utils.flatten;

    it('flattens arrays.', () => {
      const results = flatten([
        ['a', 'b'],
        'c',
        ['d', 'e']
      ]);

      expect(results).to.eql(['a', 'b', 'c', 'd', 'e']);
    });
  });
});
