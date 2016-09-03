import { flatten } from './utils';

export const BATCH = '@@rebatch/BATCH';
export const BATCH_BEGIN = '@@rebatch/BATCH.BEGIN';
export const BATCH_END = '@@rebatch/BATCH.END';
export const BATCH_COMMIT = '@@rebatch/BATCH.COMMIT';

/**
 * Determines if an action is a batch action type.
 *
 * @param {*} action
 * @returns {boolean}
 */
export const isBatchAction = (action) => {
  return action != null
    ? action.type === BATCH
    : false;
};

/**
 * Creates a batching begin signal action.
 *
 * @returns {object}
 */
export const begin = () => ({ type: BATCH_BEGIN });

/**
 * Creates a batching end signal action.
 *
 * @returns {object}
 */
export const end = () => ({ type: BATCH_END });

/**
 * Creates an action that signals state commit.
 *
 * @param {object[]} actions
 * @returns {object}
 */
export const commit = (actions) => ({ type: BATCH_COMMIT, actions });

/**
 * Batched action creator.
 *
 * @param {...*|*[]} actions
 * @returns {{type: string, actions: []}}
 */
export const batch = (...actions) => ({ type: BATCH, actions: flatten(actions) });
