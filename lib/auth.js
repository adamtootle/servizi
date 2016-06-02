const Q = require('q');
const database = require('../lib/database');
const config = require('../config');
const simpleOauth2 = require('simple-oauth2');
const request = require('request-promise');

function Auth() {
  this.getToken = () => {
    const deferred = Q.defer();
    database.find({ key: 'oauth_token' }, (err, docs) => {
      if (docs.length > 0) {
        this.token = this.oauthClient.accessToken.create(docs[0].value.token);
        this.redicrectUriWithCode = docs[0].value.redirect_uri;
        deferred.resolve(this.token);
      } else {
        deferred.reject();
      }
    });
    return deferred.promise;
  };

  this.refreshToken = () => {
    const deferred = Q.defer();
    this.getToken()
      .then(() => {
        request({
          uri: 'https://api.planningcenteronline.com/oauth/token',
          method: 'POST',
          form: {
            grant_type: 'refresh_token',
            client_id: config.oauthClientId,
            client_secret: config.oauthClientSecret,
            refresh_token: this.token.token.refresh_token,
            redirect_uri: this.redicrectUriWithCode,
          },
          json: true,
        }).then((res) => {
          database.update(
            { key: 'oauth_token' },
            {
              $set: {
                value: { token: res, redirect_uri: this.redicrectUriWithCode },
              },
            },
            {},
            () => {
              database.persistence.compactDatafile();
              this.getToken()
                .then((newToken) => {
                  deferred.resolve(newToken);
                });
            }
          );
        });
      }, (err) => {
        console.log('get token err');
      });
    return deferred.promise;
  };

  this.oauthClient = simpleOauth2({
    clientID: config.oauthClientId,
    clientSecret: config.oauthClientSecret,
    site: 'https://api.planningcenteronline.com',
  });

  this.authorizationUrl = this.oauthClient.authCode.authorizeURL({
    redirect_uri: 'playr://oauth/callback',
    scope: 'services',
  });
}

module.exports = new Auth();
