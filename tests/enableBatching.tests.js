import { expect } from 'chai';
import enableBatching from '../src/enableBatching';
import { commit } from '../src/actions';

describe('enableBatching', () => {
  const reducer = (state, action) => ({ ...state, [action.type]: true });

  it('returns a new reducer function.', () => {
    expect(
      enableBatching(() => {})
    ).to.be.a('function');
  });

  it('runs all actions in BATCH_COMMIT payload.', () => {
    const state = enableBatching(reducer)(
      {},
      commit([
        { type: 'a' },
        { type: 'b' }
      ])
    );

    expect(state).to.have.property('a', true);
    expect(state).to.have.property('b', true);
  });

  it('runs traditional actions.', () => {
    const state = enableBatching(reducer)(
      {},
      { type: 'a' }
    );

    expect(state).to.have.property('a', true);
  });
});
