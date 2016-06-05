const Q = require('q');
const http = require('./http');
const services = require('./services');

function Plans() {
  this.getFuturePlans = () => {
    const deferred = Q.defer();
    services.getServiceTypes()
      .then((serviceTypes) => {
        const promises = serviceTypes.map((serviceType) => {
          return this.getFuturePlansForServiceType(serviceType);
        });
        return Q.all(promises)
      })
      .then((results) => {
        const res = results.reduce((prev, current) => {
          if (prev === undefined) { return current; }
          return prev.concat(current);
        })
        deferred.resolve(res);
      })
      .catch((err) => {
        deferred.reject(err);
      });
    return deferred.promise;
  };

  this.getFuturePlansForServiceType = (serviceType) => {
    const deferred = Q.defer();
    http.get('https://api.planningcenteronline.com/services/v2/service_types/' + serviceType.id + '/plans?filter=future')
      .then((res) => {
        deferred.resolve(res.data);
      })
      .catch((err) => {
        deferred.reject(err);
      });
    return deferred.promise;
  };
}

module.exports = new Plans();
