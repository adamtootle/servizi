const PCO = require('pco');
const config = require('../config');
const util = require('util');
const EventEmitter = require('events');
const db = require('./database');

class PCOWrapper extends EventEmitter {
  refreshAuth() {
    db.findOne({ key: 'oauth_token' }, (err, res) => {
      this.emit('ready', null, new PCO({
        clientId: config.oauthClientId,
        clientSecret: config.oauthClientSecret,
        accessToken: res.value.token.access_token,
        redirectUri: res.value.redirect_uri,
      }));
    });
  }
}

util.inherits(PCOWrapper, EventEmitter);

module.exports = new PCOWrapper();
