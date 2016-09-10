Rebatch
=======

Add batching [middleware](http://redux.js.org/docs/Glossary.html#middleware), [enhancer](http://redux.js.org/docs/Glossary.html#store-enhancer), and [action creator](http://redux.js.org/docs/Glossary.html##action-creator)

[![Build Status](https://travis-ci.org/rstone770/rebatch.svg?branch=master)](https://travis-ci.org/rstone770/rebatch)
[![npm (scoped)](https://img.shields.io/npm/v/@rstone770/rebatch.svg?maxAge=2592000)](https://www.npmjs.com/package/@rstone770/rebatch)

```js
npm install ---save @rstone770/rebatch
```

## Why?

Sometimes you might need to group several actions in a single dispatch. This might be done to improve performance in react if you are dispatching several actions at a time that might cause several store notifications. This might also be used to improve semantics were an action might be composed of many smaller actions, but should be dispatched as one.

__Special care should be taken to ensure that batched actions do not rely on store side effects of the previous actions in the batch.__

Below is an example of incorrect usage.

```js
import * as batching from '@rstone770/rebatch';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

const reducer = (state = '', action) => {
  switch(action.type) {
    case 'SET_NAME':
      return action.name;
    default:
      return state;
  }
};

const store = createStore(
  reducer,
  compose(
    applyMiddleware(thunk, batching.middleware),
    batching.enhancer
  )
);

// The second action is a thunk that relies on store state side effects which will not exist until the batch is executed.
store.dispatch(
  batch(
    { type: 'SET_NAME', name: 'brenden' },
    (dispatch, getState) => {
      if (getState() === 'brenden') {
        // do something else.
      }
    }
  )
);
```

## Installation

```js
npm install --save @restone770/rebatch
```

After installation, you'll have to enable batching support.

```js
import * as batching from '@rstone770/rebatch';
import { createStore, applyMiddleware, compose } from 'redux';
import reducer from './reducer';

const store = createStore(
  reducer,
  compose(
    applyMiddleware(batching.middleware),
    batching.enhancer
  )
);
```

## Usage

After the store is configured, simply use the `batch` action creator to perform batch actions.

```js
import * as batching from '@rstone770/rebatch';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducer';

const store = createStore(
  reducer,
  compose(
    applyMiddleware(batching.middleware, thunk),
    batching.enhancer
  )
);

const batch = batching.batch,
  dispatch = store.dispatch;

// fires single store notification.
store.dispatch(
  batch(
    { type: 'ADD_TODO', id: '0' },
    { type: 'SOME_OTHER_ACTION' }
  )
);

// Rebatch supports complex and nested batch action types.
store.dispatch(
  batch(
    { type: 'COMPLETE_TODO', id: '0' },
    (dispatch, getState) => {
      dispatch({ type: 'SOME_OTHER_ACTION' });
    },
    batch([/* some other batch */])
  )
);

// Batch results are returned after dispatch.
const [
  promise
] = store.dispatch(
  batch(
    { type: 'COMPLETE_TODO', id: '0' },
    (dispatch, getState) => {
      return new Promise((resolve) => {
        setTimeout(() => resolve(), 500);
      });
    }
  )
);

promise.then(() => console.log('promise!!!11!'));
```

### spread([results], resultsFunction)

Nothing exciting here, takes results of a batch dispatch and spreads them over a results function.

Returns the result of the resultsFunction.

```js
import { batch, spread } from '@rstone/rebatch';

const startLoading = () => ({ type: 'set_loading', payload: true }),
      endLoading = () => ({ type: 'set_loading', payload: false });

const handleBatchResults = (loading, request) => request.then(() => store.dispatch(endLoading()));

const batchActions = batch([
    setLoading(),
    () => fetch('/') // redux-thunk
]);

const result = spread(batchActions, handleBatchResults);
```

## License

MIT
