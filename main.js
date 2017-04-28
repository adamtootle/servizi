'use strict';

//
// imports
//

const electron = require('electron');
const appEvents = require('./app/main/app-events');
const ipcEvents = require('./app/main/ipc-events');
const settings = require('./app/main/settings');
const redux = require('redux');
const reduxElectronStore = require('redux-electron-store');
const reducers = require('./app/reducers');

let storeDispatch;
const enhancer = redux.compose(
  // Must be placed after any enhancers which dispatch
  // their own actions such as redux-thunk or redux-saga
  reduxElectronStore.electronEnhancer({
    // Necessary for synched actions to pass through all enhancers
    dispatchProxy: a => storeDispatch(a),
  })
);

// Note: passing enhancer as the last argument to createStore requires redux@>=3.1.0
const store = redux.createStore(redux.combineReducers(reducers), {}, enhancer);
storeDispatch = store.dispatch;

//
// vars
//

const app = electron.app;

//
// event listeners
//

ipcEvents.setupListeners();
appEvents.setupListeners();

if (!settings.getStoredSettings().fullPlayerUI && app.dock !== undefined) {
  app.dock.hide();
}
