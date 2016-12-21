'use strict';

//
// imports
//

const electron = require('electron');
const appEvents = require('./lib/app-events');
const ipcEvents = require('./lib/ipc-events');

//
// vars
//

const app = electron.app;

//
// event listeners
//

ipcEvents.setupListeners();
appEvents.setupListeners();

if (app.dock !== undefined) {
  app.dock.hide();
}
