const NeDB = require('nedb');
const app = require('electron').app;
module.exports = new NeDB({
  filename: app.getAppPath() + '/database',
  autoload: true,
});
