import { expect } from 'chai';
import * as api from '../src';
import { batch } from '../src/actions';
import middleware from '../src/middleware';
import enhancer from '../src/enhancer';

describe('api', () => {
  it('exports an enhancer.', () => {
    expect(api).to.have.property('batch', batch);
  });

  it('exports middleware.', () => {
    expect(api).to.have.property('middleware', middleware);
  });

  it('exports a batch action creator.', () => {
    expect(api).to.have.property('enhancer', enhancer);
  });
});
