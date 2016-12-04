const PCO = require('pco');
const config = require('../config');
const util = require('util');
const EventEmitter = require('events');
const db = require('./database');

const eventEmitter = new EventEmitter();

class PCOWrapper {

  refreshAuth() {
    db.findOne({ key: 'oauth_token' }, (err, res) => {
      const pcoConfig = {
        clientId: config.oauthClientId,
        clientSecret: config.oauthClientSecret,
      };

      if (res !== null) {
        pcoConfig.accessToken = res.value.token.access_token;
        pcoConfig.redirectUri = res.value.redirect_uri;
      }

      eventEmitter.emit('ready', null, new PCO(pcoConfig));
    });
  }

  on(eventName, handler) {
    eventEmitter.on(eventName, handler);
  }
}

util.inherits(PCOWrapper, EventEmitter);

module.exports = new PCOWrapper();
