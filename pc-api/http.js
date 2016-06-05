
const request = require('request-promise');
const auth = require('../lib/auth');
const Q = require('q');

function HTTP() {
  this.get = (uri) => {
    const deferred = Q.defer();
    auth.getToken()
      .then((oauthToken) => {
        return request({
          uri,
          headers: {
            Authorization: `Bearer ${oauthToken.token.access_token}`,
          },
          json: true,
        });
      })
      .then((res) => {
        deferred.resolve(res);
      })
      .catch((err) => {
        if (err.statusCode === 401) {
          auth.refreshToken()
            .then(() => this.get(uri))
            .then((res) => {
              deferred.resolve(res);
            })
            .catch((err2) => {
              deferred.reject(err2);
            });
        }
      });
    return deferred.promise;
  };
}

module.exports = new HTTP();
