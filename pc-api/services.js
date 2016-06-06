const Q = require('q');
const http = require('./http');

function Services() {
  this.getOrganizations = () => {
    const deferred = Q.defer();
    http.get('https://api.planningcenteronline.com/services/v2')
      .then((res) => {
        deferred.resolve(res.data);
      })
      .catch((err) => {
        deferred.reject(err);
      });
    return deferred.promise;
  };

  this.getServiceTypes = () => {
    const deferred = Q.defer();
    http.get('https://api.planningcenteronline.com/services/v2/service_types')
      .then((res) => {
        deferred.resolve(res.data);
      })
      .catch((err) => {
        deferred.reject(err);
      });
    return deferred.promise;
  };
}

module.exports = new Services();
