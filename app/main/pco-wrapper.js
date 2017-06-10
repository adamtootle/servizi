const PCO = require('pco-js');
const config = require('../../config');
const util = require('util');
const EventEmitter = require('events');
const db = require('./database');

const eventEmitter = new EventEmitter();

class PCOWrapper {

  constructor() {
    const pcoConfig = {
      clientId: config.oauthClientId,
      clientSecret: config.oauthClientSecret,
    };

    this.apiClient = new PCO(pcoConfig);

    db.findOne({ key: 'oauth_token' }, (err, res) => {
      if (res) {
        this.apiClient.http.accessToken = res.value.token.access_token;
        this.apiClient.http.redirectUri = res.value.redirect_uri;
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
