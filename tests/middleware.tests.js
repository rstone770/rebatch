import { expect } from 'chai';
import middleware from '../src/middleware';
import { batch, end, begin } from '../src/actions';

describe('middleware', () => {
  it('creates middleware.', () => {
    expect(
      middleware({ dispatch: () => {} })
    ).to.be.a('function');
  });

  it('passes through none batch actions.', (done) => {
    const action = { type: 'a' },
          middlewareAPI = {
            dispatch: () => {}
          };

    middleware(middlewareAPI)(
      (action) => {
        expect(action).to.have.property('type', 'a');
        done();
      }
    )(action);
  });

  it('it dispatches all batched actions with signals.', () => {
    const dispatchedActions = [],
          middlewareAPI = {
            dispatch: (action) => dispatchedActions.push(action)
          },
          action = batch(
            { type: 'a' },
            { type: 'b' }
          );

    middleware(middlewareAPI)(
      () => {}
    )(action);

    expect(dispatchedActions).to.have.length(4);
    expect(dispatchedActions).to.eql([
      begin(),
      { type: 'a' },
      { type: 'b' },
      end()
    ]);
  });

  it('dispatches nested batches.', () => {
    const dispatchedActions = [],
          middlewareAPI = {
            dispatch: (action) => dispatchedActions.push(action)
          },
          action = batch(
            batch({ type: 'a' }),
            batch(
              batch({ type: 'b' })
            ),
            { type: 'c' }
          );

    middleware(middlewareAPI)(
      () => {}
    )(action);

    expect(dispatchedActions).to.eql([
      begin(),
      batch({ type: 'a' }),
      batch(
        batch({ type: 'b' })
      ),
      { type: 'c' },
      end()
    ]);
  });

  it('returns action results from batch actions.', () => {
    const middlewareAPI = {
            dispatch: (action) => action.type
          },
          action = batch(
            { type: 'a' },
            { type: 'b' }
          );

    expect(
      middleware(middlewareAPI)(
        () => {}
      )(action)
    ).to.eql(['a', 'b']);
  });

  it('returns action results from non batch actions.', () => {
    const middlewareAPI = {
            dispatch: () => {}
          },
          action = {
            type: 'a'
          };

    expect(
      middleware(middlewareAPI)(
        (action) => action.type
      )(action)
    ).to.equal('a');
  });
});
