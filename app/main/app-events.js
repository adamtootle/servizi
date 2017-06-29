const electron = require('electron');
const { ipcMain } = require('electron');
const autoUpdater = require('electron-updater').autoUpdater;
const join = require('path').join;
const logger = require('electron-log');
const auth = require('./auth');
const settings = require('./settings');
const store = require('./redux-store');
const reduxActions = require('../redux/actions');
const reduxActionKeys = require('../redux/actions/keys');
const utils = require('./utils');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Tray = electron.Tray;
const Menu = electron.Menu;
const MenuItem = electron.MenuItem;
const globalShortcut = electron.globalShortcut;

autoUpdater.autoDownload = false;
autoUpdater.logger = logger;
autoUpdater.logger.transports.file.level = 'info';

let mainWindow;

function AppEvents() {
  this.setupListeners = () => {
    app.on('ready', this.ready);
    app.on('open-url', this.openUrl);
    app.on('window-all-closed', this.windowAllClosed); // Quit when all windows are closed.
    app.on('activate', this.activate);
    ipcMain.on('startUpdate', () => {
      autoUpdater.downloadUpdate();
      store.dispatch({
        type: reduxActionKeys.UPDATE_PROGRESS,
        payload: 0.0,
      });
    });
    ipcMain.on('installUpdate', () => {
      autoUpdater.quitAndInstall();
    });
    autoUpdater.on('update-available', (updateInfo) => {
      store.dispatch({
        type: reduxActionKeys.UPDATE_AVAILABLE,
        payload: updateInfo,
      });
    });
    autoUpdater.on('update-not-available', () => {
      store.dispatch({
        type: reduxActionKeys.NO_UPDATE_AVAILABLE,
      });
    });
    autoUpdater.on('download-progress', (progress) => {
      store.dispatch({
        type: reduxActionKeys.UPDATE_PROGRESS,
        payload: progress.percent,
      });
    });
    autoUpdater.on('update-downloaded', () => {
      store.dispatch({
        type: reduxActionKeys.UPDATE_DOWNLOADED,
      });
    });
  };

  this.ready = () => {
    if (!utils.isDev()) {
      autoUpdater.checkForUpdates();
    }

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
      let windowWidth = screenSize.width * 0.75;
      const windowHeight = screenSize.height * 0.95;
      if (windowWidth / windowHeight > 1.5) {
        windowWidth = windowHeight * 1.5;
      }
      windowConfig = {
        // frame: false,
        width: windowWidth,
        height: windowHeight,
        vibrancy: 'dark',
        titleBarStyle: 'hidden-inset',
      };
    }
    // Create the browser window.
    mainWindow = new BrowserWindow(windowConfig);

    // and load the index.html of the app.
    mainWindow.loadURL(`file://${app.getAppPath()}/index.html`);

    // Open the DevTools.
    if (utils.isDev()) {
      mainWindow.webContents.openDevTools();
    }

    if (!storedSettings.fullPlayerUI) {
      mainWindow.on('closed', () => {
        mainWindow = null;
      });

      mainWindow.on('blur', () => {
        mainWindow.hide();
      });

      // setUpStatusBarIcon();
    }

    mainWindow.show();

    globalShortcut.register('MediaPlayPause', () => {
      store.dispatch(reduxActions.player.playPauseAttachment());
    });

    globalShortcut.register('MediaPreviousTrack', () => {
      store.dispatch(reduxActions.player.previousAttachment());
    });

    globalShortcut.register('MediaNextTrack', () => {
      store.dispatch(reduxActions.player.nextAttachment());
    });

    setupAppMenu();
  };

  this.openUrl = (ev, url) => {
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
        mainWindow.webContents.send('didAddAccount', {
          redirect_uri: tokenConfig.redirect_uri,
          token,
        });
        mainWindow.focus();
      }
    });
  };

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

function setupAppMenu() {
  const template = [];

  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'quit' },
      ],
    });
  }

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

function setUpStatusBarIcon() {
  const statusBarIcon = new Tray(`${app.getAppPath()}/images/status-bar-icon.png`);
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
