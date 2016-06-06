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

// api.plans.getFuturePlans()
//   .then((futurePlans) => {
//     console.log('futurePlans');
//     console.log(futurePlans);
//   });

if (app.dock !== undefined) {
  app.dock.hide();
}
