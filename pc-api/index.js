const services = require('./services');
const plans = require('./plans');

module.exports = function() {
  this.services = services;
  this.plans = plans;
};







// const PCAApi = require('./pc-api');
// const api = new PCAApi();
// api.services.get().then(function(value){
//   console.log('first');
//   console.log(value);
//   return value;
// }).done(function(err, value){
//   console.log('done');
//   console.log(err);
//   console.log(value);
// });

// const NeDB = require('nedb');
// const database = new NeDB({
//   filename: app.getAppPath() + '/database',
//   autoload: true,
// });

// ipcMain.on('login', (event, arg) => {
//   console.log(arg);  // prints "ping"
//   event.returnValue = 'pong';
// });