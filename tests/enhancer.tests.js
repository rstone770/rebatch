import chai, { expect } from 'chai';
import { createStore } from 'redux';
import enhancer from '../src/enhancer';
import { batch, begin, end } from '../src/actions';

const action = (name) => ({ type: 'value', name });

const testReducer = (state = {}, action) => {
  return action.type === 'value'
    ? { ...state, [action.name]: true }
    : state;
};

const createEnhancedStore = (reducer) => {
  return createStore(
    reducer,
    enhancer
  );
};

describe('enhancer', () => {
  it('exposes redux api.', () => {
    const store = createEnhancedStore(() => {}),
          methods = Object.keys(store);

    expect(methods).to.have.length(4);
    expect(store.subscribe).to.be.a('function');
    expect(store.dispatch).to.be.a('function');
    expect(store.getState).to.be.a('function');
    expect(store.replaceReducer).to.be.a('function');
  });

  describe('dispatch', () => {
    it('explodes on raw batch dispatch.', () => {
      const store = createEnhancedStore(() => {});

      expect(
        () => store.dispatch(batch())
      ).to.throw();
    });

    it('passes through non batched actions.', () => {
      const reducer = chai.spy(testReducer),
            subscriber = chai.spy(),
            store = createEnhancedStore(reducer);

      reducer.reset();
      store.subscribe(subscriber);

      store.dispatch(action('a'));
      store.dispatch(action('b'));

      expect(subscriber).to.have.been.called.exactly(2);
      expect(reducer).to.have.been.called.exactly(2);
      expect(store.getState()).to.eql({
        a: true,
        b: true
      });
    });

    it('returns action results', () => {
      const store = createEnhancedStore(testReducer),
            result = store.dispatch(action('1'));

      expect(result).to.eql(action('1'));
    });

    it('buffers batched actions.', () => {
      const reducer = chai.spy(testReducer),
            subscriber = chai.spy(),
            store = createEnhancedStore(reducer);

      reducer.reset();
      store.subscribe(subscriber);

      store.dispatch(begin());
      expect(subscriber).to.have.been.called.exactly(0);
      expect(reducer).to.have.been.called.exactly(0);

      store.dispatch(action('a'));
      store.dispatch(action('b'));
      expect(subscriber).to.have.been.called.exactly(0);
      expect(reducer).to.have.been.called.exactly(0);

      store.dispatch(end());
      expect(subscriber).to.have.been.called.exactly(1);
      expect(reducer).to.have.been.exactly(2);
      expect(store.getState()).to.eql({
        a: true,
        b: true
      });
    });

    it('buffers deep batches.', () => {
      const reducer = chai.spy(testReducer),
            subscriber = chai.spy(),
            store = createEnhancedStore(reducer);

      reducer.reset();
      store.subscribe(subscriber);

      [
        begin(),
        begin(),
        action('a'),
        action('b'),
        end(),
        action('c'),
        action('d'),
        begin(),
        end(),
        action('e'),
        end()
      ].forEach((action) => store.dispatch(action));
      expect(subscriber).to.have.been.called.exactly(1);
      expect(reducer).to.have.been.called.exactly(5);
      expect(store.getState()).to.eql({
        a: true,
        b: true,
        c: true,
        d: true,
        e: true
      });
    });
  });
});
