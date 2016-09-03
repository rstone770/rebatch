import { flatten } from './utils';
import { isBatchAction, begin, end } from './actions';

/**
 * Prepends and appends actions with batching signal actions.
 *
 * @param {*[]} actions
 * @returns {*[]}
 */
const createBatch = (actions) => {
  return flatten([begin(), actions, end()]);
};

/**
 * Batch middleware that will recursively dispatch all actions while applying batch
 * signalling.
 *
 * @param {function} dispatch
 * @returns {function(*)}
 */
export default ({
  dispatch
}) => {
  return (next) => {
    return (action) => {
      if (isBatchAction(action)) {
        return createBatch(action.actions)
          .map((action) => dispatch(action))
          .slice(1, -1);
      }

      return next(action);
    };
  };
};
