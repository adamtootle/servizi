const electron = require('electron');
const config = require('./config');
const analytics = require('./app/main/analytics');
const auth = require('./app/main/auth');

global.servizi = {
  handleOpenUrl: function handleOpenUrl(ev, url) {
    const code = url.split('code=')[1];
    // let token;
    const tokenConfig = {
      code,
      redirect_uri: 'servizi://oauth/callback',
    };

    // Callbacks
    // Save the access token
    auth.oauthClient.authorizationCode.getToken(tokenConfig, (error, token) => {
      // let message;
      if (error) {
        // message = error.message;
      } else {
        // message = auth.oauthClient.accessToken.create(token);
        global.servizi.mainWindow.webContents.send('didAddAccount', {
          redirect_uri: tokenConfig.redirect_uri,
          token,
        });
        global.servizi.mainWindow.focus();
        analytics.recordEvent(config.aws.eventNames.addAccount);
      }
    });
  },
};

const shouldQuit = electron.app.makeSingleInstance((argv) => {
  // Someone tried to run a second instance, we should focus our window.
  if (global.servizi.mainWindow) {
    if (global.servizi.mainWindow.isMinimized()) {
      global.servizi.mainWindow.restore();
    }

    global.servizi.mainWindow.focus();
    global.servizi.handleOpenUrl(null, argv[1]);
  }
});

if (shouldQuit) {
  electron.app.quit();
}

//
// imports
//


const appEvents = require('./app/main/app-events');
const ipcEvents = require('./app/main/ipc-events');
const settings = require('./app/main/settings');
require('./app/main/redux-store');

//
// vars
//

const app = electron.app;
global.servizi.database = require('./app/main/database');

//
// event listeners
//

ipcEvents.setupListeners();
appEvents.setupListeners();

if (!settings.getStoredSettings().fullPlayerUI && app.dock !== undefined) {
  app.dock.hide();
}
