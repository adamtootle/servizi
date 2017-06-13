const PCO = require('pco-js');
const config = require('../../config');
const util = require('util');
const EventEmitter = require('events');
const { accounts } = require('./database');

const eventEmitter = new EventEmitter();

class PCOWrapper {

  constructor() {
    const pcoConfig = {
      clientId: config.oauthClientId,
      clientSecret: config.oauthClientSecret,
    };

    this.apiClient = new PCO(pcoConfig);

    accounts.findOne({}, (err, res) => {
      if (res) {
        this.apiClient.http.accessToken = res.tokenInfo.access_token;
        this.apiClient.http.redirectUri = res.tokenInfo.redirect_uri;
      }

      this.ready = true;
      eventEmitter.emit('ready', null, this.apiClient);
    });
  }

  on(eventName, handler) {
    eventEmitter.on(eventName, handler);
  }
}

util.inherits(PCOWrapper, EventEmitter);

module.exports = new PCOWrapper();
