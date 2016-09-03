import { BATCH_BEGIN, BATCH_END, commit, isBatchAction } from './actions';
import enableBatching from './enableBatching';

/**
 * Batch store enhancer.
 *
 * @param {function(function, *=)} createStore
 * @returns {function(*=, *=)}
 */
export default (createStore) => {
  return (reducer, preload) => {
    const store = createStore(enableBatching(reducer), preload);

    let batch = [],
        batches = 0;

    /**
     * Drains batch. Simply returns all batch value while resetting batching state.
     *
     * @returns {Array}
     */
    const drain = () => {
      const values = batch;

      batch = [];
      batches = 0;

      return values;
    };

    /**
     * Handles dispatches of batch type actions. These should never appear at this level because they should be
     * expanded and formatted as a list of actions. Just throw an error for now.
     */
    const handleBatchDispatch = () => {
      throw new Error('a raw batch() action was dispatched without first being formatted. Did you forget to add rebatch middleware?.');
    };

    /**
     * Replace the reducer, with our batched enabled reducer.
     *
     * @param {function(*, object)} reducer
     * @returns {void}
     */
    const replaceReducer = (reducer) => store.replaceReducer(enableBatching(reducer));

    /**
     * Dispatch actions.
     *
     * We buffer actions by simply counting the amount of pending batches. When all batches complete, we push all
     * captured actions through an enhanced reducer with a single dispatch.
     *
     * All actions outside of pending states will be dispatched immediately.
     *
     * @param {object} action
     * @returns {*}
     */
    const dispatch = (action) => {
      const next = store.dispatch;

      if (action == null) {
        return next(action);
      } else if (isBatchAction(action)) {
        handleBatchDispatch();
      }

      if (action.type === BATCH_BEGIN) {
        batches += 1;
      } else if (action.type === BATCH_END) {
        batches -= 1;

        if (batches === 0) {
          return next(commit(drain()));
        }
      } else if (batches > 0) {
        batch.push(action);
      } else {
        return next(action);
      }

      return action;
    };

    return {
      ...store,
      dispatch,
      replaceReducer
    };
  };
};
