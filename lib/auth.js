const database = require('../lib/database');
const config = require('../config');
const keys = require('./keys');
const Promise = require('bluebird');
const simpleOauth2 = require('simple-oauth2');

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
  // functions
  //
  this.getStoredToken = () => {
    return new Promise((resolve, reject) => {
      database.find({ key: 'oauth_token' }, (err, docs) => {
        if (docs.length > 0) {
          // this.token = this.oauthClient.accessToken.create(docs[0].value.token);
          // this.redicrectUriWithCode = docs[0].value.redirect_uri;
          resolve(docs[0].value.token);
        } else {
          reject(new Error(keys.AuthErrorKey));
        }
      });
    });
  };

// this.getTokenWithCredentials = (credentials) => {
//   console.log('getTokenWithCredentials');
//   console.log(credentials);
//   return;
//   const deferred = Q.defer();
//   this.oauthClient.password.getToken(credentials,  (err, res) => {
//     if (err) {
//       deferred.reject();
//     } else {
//       console.log('auth');
//       console.log(res);
//       token = oauth2.accessToken.create(result);
//     }
//   });
//   return deferred.promise;
// };
}

module.exports = new Auth();
