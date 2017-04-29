const electron = require('electron');
const redux = require('redux');
const reduxElectronStore = require('redux-electron-store');
const auth = require('./auth');
const database = require('./database');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Tray = electron.Tray;
const Menu = electron.Menu;
const MenuItem = electron.MenuItem;
const globalShortcut = electron.globalShortcut;
const settings = require('./settings');


let mainWindow;

function AppEvents() {
  this.setupListeners = () => {
    app.on('ready', this.ready);
    app.on('open-url', this.openUrl);
    app.on('window-all-closed', this.windowAllClosed); // Quit when all windows are closed.
    app.on('activate', this.activate);
  };

  this.ready = () => {
    const screenSize = electron.screen.getPrimaryDisplay().workAreaSize;
    const storedSettings = settings.getStoredSettings();
    let windowConfig = {
      width: 600,
      height: 460,
      // frame: false,
      // movable: false,
      // resizable: false,
      minimizable: false,
      maximizable: false,
      show: false,
      skipTaskbar: true,
    };

    if (storedSettings.fullPlayerUI) {
      windowConfig = {
        // frame: false,
        width: screenSize.width * 0.75,
        height: screenSize.height * 0.95,
        vibrancy: 'ultra-dark',
        titleBarStyle: 'hidden-inset',
      };
    }
    // Create the browser window.
    mainWindow = new BrowserWindow(windowConfig);

    // and load the index.html of the app.
    mainWindow.loadURL('file://' + app.getAppPath() + '/index.html');

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    if (!storedSettings.fullPlayerUI) {
      mainWindow.on('closed', () => {
        mainWindow = null;
      });

      mainWindow.on('blur', () => {
        mainWindow.hide();
      });

      setUpStatusBarIcon();
    }

    mainWindow.show();

    globalShortcut.register('MediaPlayPause', () => {
      mainWindow.webContents.send('MediaPlayPause');
    });

    globalShortcut.register('MediaPreviousTrack', () => {
      mainWindow.webContents.send('MediaPreviousTrack');
    });

    globalShortcut.register('MediaNextTrack', () => {
      mainWindow.webContents.send('MediaNextTrack');
    });
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
    auth.oauthClient.authorizationCode.getToken(tokenConfig, (error, result) => {
      let message;
      if (error) {
        console.log('Access Token Error', error.message);
        message = error.message;
      } else {
        message = auth.oauthClient.accessToken.create(result);
        database.insert({
          key: 'oauth_token',
          value: { token: result },
        });
        mainWindow.webContents.send('didLogin', result);
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

function setUpStatusBarIcon() {
  const statusBarIcon = new Tray(app.getAppPath() + '/images/status-bar-icon.png');
  statusBarIcon.on('click', (err, bounds) => {
    mainWindow.setBounds({
      x: bounds.x,
      y: bounds.y,
      width: mainWindow.getBounds().width,
      height: mainWindow.getBounds().height,
    });

    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  });

  statusBarIcon.on('right-click', () => {
    const menu = new Menu();
    menu.append(new MenuItem({ label: 'Quit', click() { app.quit(); } }));
    statusBarIcon.popUpContextMenu(menu);
  });
  // mainWindow.setBounds({
  //   x: statusBarIcon.getBounds().x,
  //   y: statusBarIcon.getBounds().y,
  //   width: mainWindow.getBounds().width,
  //   height: mainWindow.getBounds().height
  // });
  mainWindow.setBounds({
    x: 0,
    y: 0,
    width: 1000,
    height: 400,
  });
}

module.exports = new AppEvents();