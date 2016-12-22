'use strict';

//
// imports
//

const electron = require('electron');
const appEvents = require('./lib/app-events');
const ipcEvents = require('./lib/ipc-events');
const settings = require('./lib/settings');

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
