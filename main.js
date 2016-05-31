'use strict';

const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
const globalShortcut = electron.globalShortcut;
const Tray = electron.Tray;
const Menu = electron.Menu;
const MenuItem = electron.MenuItem;
const ipcMain = electron.ipcMain;
const config = require('./config');

const NeDB = require('nedb');
const database = new NeDB({
  filename: app.getAppPath() + '/database',
  autoload: true,
});

ipcMain.on('login', (event, arg) => {
  electron.shell.openExternal(authorization_uri);
});

const oauth2 = require('simple-oauth2')({
  clientID: config.oauthClientId,
  clientSecret: config.oauthClientSecret,
  site: 'https://api.planningcenteronline.com',
});

const authorization_uri = oauth2.authCode.authorizeURL({
  redirect_uri: 'playr://oauth/callback',
  scope: 'services',
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

app.dock.hide();

function didClickStatusBarIcon(ev, bounds) {

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
}

function createMainWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 280,
    height: 460,
    // frame: false,
    // movable: false,
    // resizable: false,
    minimizable: false,
    maximizable: false,
    show: false,
  });

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  mainWindow.on('blur', () => {
    mainWindow.hide();
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// app.on('ready', createWindow);

let statusBarIcon = null;

function setupStatusBarIcon() {
  statusBarIcon = new Tray(app.getAppPath() + '/images/status-bar-icon.png');
  const contextMenu = Menu.buildFromTemplate([
    {label: 'Item1', type: 'radio'},
    {label: 'Item2', type: 'radio'},
    {label: 'Item3', type: 'radio', checked: true},
    {label: 'Item4', type: 'radio'}
  ]);
  statusBarIcon.setToolTip('This is my application.');
  // appIcon.setContextMenu(contextMenu);
  statusBarIcon.on('click', didClickStatusBarIcon);
  statusBarIcon.on('right-click', () => {
    const menu = new Menu();
    menu.append(new MenuItem({label: 'Quit', click() { app.quit(); }}));
    statusBarIcon.popUpContextMenu(menu);
  });
}

app.on('ready', createMainWindow);
app.on('ready', setupStatusBarIcon);
app.on('open-url', (ev, url) => {
  const code = url.split('code=')[1];
  let token;
  const tokenConfig = {
    code: code,
    redirect_uri: 'playr://oauth/callback'
  };
  // Callbacks
  // Save the access token
  oauth2.authCode.getToken(tokenConfig, (error, result) => {
    let message;
    if (error) {
      console.log('Access Token Error', error.message);
      message = error.message;
    } else {
      // token = oauth2.accessToken.create(result);
      message = oauth2.accessToken.create(result);
      // electron.dialog.showMessageBox(mainWindow, {
      //   type: 'info',
      //   message: JSON.stringify(result),
      //   buttons: ['ok'],
      // });
      database.insert({
        key: 'oauth_token',
        value: result,
      });
      mainWindow.webContents.send('login', result);
    }
  });
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('browser-window-focus', (event) => {
  
});

app.on('browser-window-blur', () => {

});
