const electron = require('electron');
const { ipcMain } = require('electron');
const autoUpdater = require('electron-updater').autoUpdater;
const logger = require('electron-log');
const settings = require('./settings');
const store = require('./redux-store');
const reduxActions = require('../redux/actions');
const reduxActionKeys = require('../redux/actions/keys');
const utils = require('./utils');
const config = require('../../config');
const analytics = require('./analytics');
const { dialog } = require('electron');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Tray = electron.Tray;
const Menu = electron.Menu;
const MenuItem = electron.MenuItem;
const globalShortcut = electron.globalShortcut;

autoUpdater.autoDownload = false;
autoUpdater.logger = logger;
autoUpdater.logger.transports.file.level = 'info';

function AppEvents() {
  this.setupListeners = () => {
    app.on('ready', this.ready);
    app.on('open-url', global.servizi.handleOpenUrl);
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
    global.servizi.mainWindow = new BrowserWindow(windowConfig);

    // and load the index.html of the app.
    global.servizi.mainWindow.loadURL(`file://${app.getAppPath()}/index.html`);

    // Open the DevTools.
    if (utils.isDev()) {
      global.servizi.mainWindow.webContents.openDevTools();
    }

    if (!storedSettings.fullPlayerUI) {
      global.servizi.mainWindow.on('closed', () => {
        global.servizi.mainWindow = null;
      });

      global.servizi.mainWindow.on('blur', () => {
        global.servizi.mainWindow.hide();
      });

      // setUpStatusBarIcon();
    }

    global.servizi.mainWindow.show();

    globalShortcut.register('MediaPlayPause', () => {
      if (store.getState().player.playAudio) {
        // already playing, so we're pausing it
        analytics.recordEvent(config.aws.eventNames.pauseAttachment, {
          method: 'keyboard',
        });
      } else {
        // already paused, so we're playing it
        analytics.recordEvent(config.aws.eventNames.playAttachment, {
          method: 'keyboard',
        });
      }

      store.dispatch(reduxActions.player.playPauseAttachment());
    });

    globalShortcut.register('MediaPreviousTrack', () => {
      store.dispatch(reduxActions.player.previousAttachment());
      analytics.recordEvent(config.aws.eventNames.previousAttachment, {
        method: 'keyboard',
      });
    });

    globalShortcut.register('MediaNextTrack', () => {
      store.dispatch(reduxActions.player.nextAttachment());
      analytics.recordEvent(config.aws.eventNames.nextAttachment, {
        method: 'keyboard',
      });
    });

    app.setAsDefaultProtocolClient('servizi');

    setupAppMenu();
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
    if (global.servizi.mainWindow === null) {
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
    global.servizi.mainWindow.setBounds({
      x: bounds.x,
      y: bounds.y,
      width: global.servizi.mainWindow.getBounds().width,
      height: global.servizi.mainWindow.getBounds().height,
    });

    if (global.servizi.mainWindow.isVisible()) {
      global.servizi.mainWindow.hide();
    } else {
      global.servizi.mainWindow.show();
    }
  });

  statusBarIcon.on('right-click', () => {
    const menu = new Menu();
    menu.append(new MenuItem({ label: 'Quit', click() { app.quit(); } }));
    statusBarIcon.popUpContextMenu(menu);
  });
  // global.servizi.mainWindow.setBounds({
  //   x: statusBarIcon.getBounds().x,
  //   y: statusBarIcon.getBounds().y,
  //   width: global.servizi.mainWindow.getBounds().width,
  //   height: global.servizi.mainWindow.getBounds().height
  // });
  global.servizi.mainWindow.setBounds({
    x: 0,
    y: 0,
    width: 1000,
    height: 400,
  });
}

module.exports = new AppEvents();
