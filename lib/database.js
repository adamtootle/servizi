const utils = require('./utils');
const NeDB = require('nedb');
const electron = utils.isRenderer() ? require('electron').remote : require('electron');
const app = electron.app;

module.exports = new NeDB({
  filename: app.getAppPath() + '/database',
  autoload: true,
});
