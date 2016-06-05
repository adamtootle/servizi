const auth = require('./auth');
const database = require('./database');
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Tray = electron.Tray;
const Menu = electron.Menu;
const MenuItem = electron.MenuItem;
const {dialog} = require('electron');

let mainWindow;

function AppEvents() {
  this.ready = () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
      width: 280,
      height: 460,
      frame: false,
      movable: false,
      resizable: false,
      minimizable: false,
      maximizable: false,
      show: false,
      skipTaskbar: true,
    });

    // and load the index.html of the app.
    mainWindow.loadURL('file://' + app.getAppPath() + '/index.html');

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => {
      mainWindow = null;
    });

    mainWindow.on('blur', () => {
      mainWindow.hide();
    });



    const statusBarIcon = new Tray(app.getAppPath() + '/images/status-bar-icon.png');
    statusBarIcon.on('click', function(err, bounds) {
      mainWindow.setBounds({
        x: bounds.x,
        y: bounds.y,
        width: mainWindow.getBounds().width,
        height: mainWindow.getBounds().height
      });

      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow.show();
      }
    });

    statusBarIcon.on('right-click', () => {
      const menu = new Menu();
      menu.append(new MenuItem({label: 'Quit', click() { app.quit(); }}));
      statusBarIcon.popUpContextMenu(menu);
    });
    mainWindow.setBounds({
      x: statusBarIcon.getBounds().x,
      y: statusBarIcon.getBounds().y,
      width: mainWindow.getBounds().width,
      height: mainWindow.getBounds().height
    });
    mainWindow.show();
  };

  this.openUrl = (ev, url) => {
    const code = url.split('code=')[1];
    let token;
    const tokenConfig = {
      code: code,
      redirect_uri: 'playr://oauth/callback'
    };
    // Callbacks
    // Save the access token
    auth.oauthClient.authCode.getToken(tokenConfig, (error, result) => {
      let message;
      if (error) {
        console.log('Access Token Error', error.message);
        message = error.message;
      } else {
        message = auth.oauthClient.accessToken.create(result);
        database.insert({
          key: 'oauth_token',
          value: { token: result, redirect_uri: url },
        });
        mainWindow.webContents.send('login', result);
      }
    });
  }

  this.windowAllClosed = () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  };

  this.activate = () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
      createWindow();
    }
  };
}

module.exports = new AppEvents();
