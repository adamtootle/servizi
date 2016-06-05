'use strict';

//
// imports
//

const electron = require('electron');
const config = require('./config');
const database = require('./lib/database');
const auth = require('./lib/auth');
const PCApi = require('./pc-api');
const appEvents = require('./lib/app-events');
const ipcEvents = require('./lib/ipc-events');

//
// vars
//

const app = electron.app;
const globalShortcut = electron.globalShortcut;
const ipcMain = electron.ipcMain;
const api = new PCApi();
let mainWeindow;
let statusBarIcon = null;

//
// event listeners
//

ipcMain.on('doWebLogin', ipcEvents.doWebLogin);
ipcMain.on('validateAuth', ipcEvents.validateAuth);
app.on('ready', appEvents.ready);
app.on('open-url', appEvents.openUrl);
app.on('window-all-closed', appEvents.windowAllClosed); // Quit when all windows are closed.
app.on('activate', appEvents.activate);

// api.plans.getFuturePlans()
//   .then((futurePlans) => {
//     console.log('futurePlans');
//     console.log(futurePlans);
//   });

if (app.dock !== undefined) {
  app.dock.hide();
}
