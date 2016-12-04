const database = require('../lib/database');
const config = require('../config');
const keys = require('./keys');
const Promise = require('bluebird');
const simpleOauth2 = require('simple-oauth2');
const request = require('request-promise');

function Auth() {
  //
  // properties
  //
  this.oauthClient = simpleOauth2.create({
    client: {
      id: config.oauthClientId,
      secret: config.oauthClientSecret,
    },
    auth: {
      tokenHost: 'https://api.planningcenteronline.com',
    },
  });

  this.authorizationUrl = this.oauthClient.authorizationCode.authorizeURL({
    redirect_uri: 'playr://oauth/callback',
    scope: 'services',
  });

  //
  // public methods
  //

  this.getStoredToken = function getStoredToken() {
    return new Promise((resolve) => {
      this.loadStoredToken()
          .then(this.checkIfShouldRefreshToken)
          .then(this.refreshStoredToken)
          .then((token) => {
            resolve(token);
          });
    });
  };

  this.loadStoredToken = function loadStoredToken() {
    return new Promise((resolve) => {
      database.findOne({ key: 'oauth_token' }, (err, doc) => {
        if (doc) {
          resolve(doc.value);
        } else {
          resolve(null);
        }
      });
    });
  };

  this.checkIfShouldRefreshToken = function shouldRefreshToken(_tokenRecord) {
    const tokenRecord = _tokenRecord;
    return new Promise((resolve) => {
      if (tokenRecord === null) {
        resolve(null);
        return;
      }

      const timeDifference = Math.floor(Date.now() / 1000) - tokenRecord.token.created_at;
      if (timeDifference >= tokenRecord.token.expires_in) {
        tokenRecord.should_refresh = true;
      } else {
        tokenRecord.should_refresh = false;
      }
      resolve(tokenRecord);
    });
  };

  this.refreshStoredToken = (tokenRecord) => {
    return new Promise((resolve) => {
      if (tokenRecord === null) {
        resolve(null);
        return;
      }

      if (tokenRecord.should_refresh) {
        const tokenObject = {
          access_token: tokenRecord.token.access_token,
          refresh_token: tokenRecord.token.refresh_token,
          expires_in: tokenRecord.token.expires_in,
        };
        const token = this.oauthClient.accessToken.create(tokenObject);
        token.refresh()
        .then((tokenResponse) => {
          database.findOne({ key: 'oauth_token' }, (err, doc) => {
            database.update(
              { _id: doc._id },
              { key: 'oauth_token', value: tokenResponse },
              { multi: false },
              () => {
                resolve(tokenResponse);
              }
            );
          });
        })
        .catch((err) => {
          console.log('err');
          console.log(err);
        });
      } else {
        resolve(tokenRecord);
      }
    });
  };
}

module.exports = new Auth();
