
const request = require('request-promise');
const auth = require('../lib/auth');
const Q = require('q');

function HTTP() {
  this.get = (uri) => {
    const deferred = Q.defer();
    auth.getToken()
      .then((oauthToken) => {
        request({
          uri,
          headers: {
            Authorization: `Bearer ${oauthToken.token.access_token}`,
          },
          json: true,
        })
        .then((res) => {
          deferred.resolve(res);
        }, (err) => {
          if (err.statusCode === 401) {
            auth.refreshToken()
              .done(() => {
                this.get(uri)
                  .done((body) => {
                    deferred.resolve(body);
                  });
              });
          }
        });
      });
    return deferred.promise;
  };
}

module.exports = new HTTP();
