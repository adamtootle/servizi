const { accounts } = require('./database');
const config = require('../../config');
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
    redirect_uri: 'servizi://oauth/callback',
    scope: 'services',
  });

  //
  // public methods
  //

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

  this.shouldRefreshToken = function shouldRefreshToken(token) {
    if (!token) {
      return true;
    }

    const timeDifference = Math.floor(Date.now() / 1000) - token.created_at;
    if (timeDifference >= token.expires_in) {
      return true;
    }

    return false;
  };

  this.refreshSelectedAccountTokenIfNecessary = (tokenRecord) => {
    return new Promise((resolve, reject) => {
      accounts.findOne({ selected: true }, (err, existingTokenResult) => {
        if (!existingTokenResult) {
          reject();
        } else if (err) {
          reject(err);
        }

        if (this.shouldRefreshToken(existingTokenResult.tokenInfo.token)) {
          const { access_token, refresh_token, expires_in } = existingTokenResult.tokenInfo.token;
          const oauthToken = this.oauthClient.accessToken.create({ access_token, refresh_token, expires_in });
          oauthToken.refresh()
            .then((tokenResponse) => {
              accounts.update(
                { id: existingTokenResult._id },
                { $set: { token: tokenResponse.token } },
                {},
                () => {
                  resolve();
                }
              );
            })
            .catch(reject);
        } else {
          resolve();
        }
      });
      // if (tokenRecord === null) {
      //   resolve(null);
      //   return;
      // }

      // const tokenObject = {
      //   access_token: tokenRecord.token.access_token,
      //   refresh_token: tokenRecord.token.refresh_token,
      //   expires_in: tokenRecord.token.expires_in,
      // };
      
      // token.refresh()
      // .then((tokenResponse) => {
      //   database.findOne({ key: 'oauth_token' }, (err, doc) => {
      //     database.update(
      //       { _id: doc._id },
      //       { key: 'oauth_token', value: tokenResponse },
      //       { multi: false },
      //       () => resolve(tokenResponse)
      //     );
      //   });
      // })
      // .catch(reject);
    });
  };
}

module.exports = new Auth();
