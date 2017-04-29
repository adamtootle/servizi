
//
// imports
//

const electron = require('electron');
const appEvents = require('./app/main/app-events');
const ipcEvents = require('./app/main/ipc-events');
const settings = require('./app/main/settings');
require('./app/main/redux-store');

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
