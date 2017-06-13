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

    accounts.findOne({ selected: true }, (err, selectedAccountResult) => {
      if (selectedAccountResult) {
        this.apiClient.http.accessToken = selectedAccountResult.tokenInfo.token.access_token;
        this.apiClient.http.redirectUri = selectedAccountResult.tokenInfo.token.redirect_uri;
        this.ready = true;
        eventEmitter.emit('ready', null, this.apiClient);
      } else {
        accounts.findOne({ selected: true }, (err, accountResult) => {
          if (accountResult) {
            this.apiClient.http.accessToken = accountResult.tokenInfo.token.access_token;
            this.apiClient.http.redirectUri = accountResult.tokenInfo.token.redirect_uri;
            this.ready = true;
            eventEmitter.emit('ready', null, this.apiClient);
          }
        });
      }
    });
  }

  on(eventName, handler) {
    eventEmitter.on(eventName, handler);
  }
}

util.inherits(PCOWrapper, EventEmitter);

module.exports = new PCOWrapper();
