const electron = require('electron');
const auth = require('./auth');
const ipcMain = electron.ipcMain;

function IpcEvents() {
  this.setupListeners = () => {
    ipcMain.on('doWebLogin', this.doWebLogin);
  };

  this.doWebLogin = (event, args) => {
    console.log('auth.authorizationUrl');
    console.log(auth.authorizationUrl);
    electron.shell.openExternal(auth.authorizationUrl);
  };
}

module.exports = new IpcEvents();
