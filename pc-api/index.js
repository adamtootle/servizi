const Q = require('q');
const http = require('./http');
const services = require('./services');
const plans = require('./plans');

function PCApi() {
  this.reloadMe = () => {
    const deferred = Q.defer();
    http.get('https://api.planningcenteronline.com/services/v2/me')
      .then((res) => {
        this.currentUser = res;
        deferred.resolve(res.data);
      })
      .catch((err) => {
        deferred.reject(err);
      });
    return deferred.promise;
  };
  this.services = services;
  this.plans = plans;
}

module.exports = new PCApi();

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