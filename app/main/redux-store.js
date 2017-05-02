const redux = require('redux');
const reduxElectronStore = require('redux-electron-store');
const thunk = require('redux-thunk');
const reducers = require('../reducers');

let storeDispatch;
const enhancer = redux.compose(
  redux.applyMiddleware(thunk.default),
  reduxElectronStore.electronEnhancer({ dispatchProxy: a => storeDispatch(a) })
);

// Note: passing enhancer as the last argument to createStore requires redux@>=3.1.0
const store = redux.createStore(redux.combineReducers(reducers), {}, enhancer);
storeDispatch = store.dispatch;

module.exports = store;
