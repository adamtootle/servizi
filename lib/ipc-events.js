const electron = require('electron');
const auth = require('./auth');
const pcApi = require('../pc-api');
const plans = require('../pc-api/plans');
const services = require('../pc-api/services');
const ipcMain = electron.ipcMain;

function IpcEvents() {
  this.setupListeners = () => {
    ipcMain.on('doWebLogin', this.doWebLogin);
    ipcMain.on('validateAuth', this.validateAuth);
    ipcMain.on('getSchedules', this.getSchedules);
  };

  this.doWebLogin = (event, args) => {
    electron.shell.openExternal(auth.authorizationUrl);
  };

  this.validateAuth = (event, args) => {
    auth.getToken()
      .then(pcApi.reloadMe)
      .catch((err) => {
        if (err) {
          event.sender.send('validateAuth', false);
        }
      })
      .done((res) => {
        if (res) {
          event.sender.send('validateAuth', true);
        }
      });
  };

  this.getSchedules = (ev) => {
    plans.getFuturePlans()
      .then((res) => {
        ev.sender.send('getSchedules', res);
      });
  };
}

module.exports = new IpcEvents();
