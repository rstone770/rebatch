import { BATCH_COMMIT } from './actions';

/**
 * Enhances a reducer to support batching actions.
 *
 * @param {function(*, object)} reducer
 * @returns {function(*, object)}
 */
export default (reducer) => {
  return (state, action) => {
    switch (action.type) {
      case BATCH_COMMIT:
        return action.actions.reduce((state, action) => reducer(state, action), state);
      default:
        return reducer(state, action);
    }
  };
};
