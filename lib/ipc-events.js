const electron = require('electron');
const auth = require('./auth');
const plans = require('../pc-api/plans');

function IpcEvents() {
  this.doWebLogin = (event, args) => {
    electron.shell.openExternal(auth.authorizationUrl);
  };

  this.validateAuth = (event, args) => {
    auth.getToken()
      .then(plans.getFuturePlans)
      .catch((err) => {
        console.log(err);
        if (err) {
          event.sender.send('validateAuth', false);
        }
      })
      .done((stuff) => {
        if (stuff) {
          event.sender.send('validateAuth', true);
        }
      });
  };
}

module.exports = new IpcEvents();
