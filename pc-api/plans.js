const Q = require('q');
const http = require('./http');
const services = require('./services');

function Plans() {
  this.getFuturePlans = () => {
    services.getServiceTypes()
      .done((serviceTypes) => {
        const promises = serviceTypes.map((serviceType) => {
          return this.getFuturePlansForServiceType(serviceType);
        });
        Q.all(promises)
          .then((results) => {
            console.log(results);
            const res = results.reduce((prev, current) => {
              if (prev === undefined) {
                return current;
              }

              return prev.concat(current);
            });
            console.log(res);
          });
      });
  };

  this.getFuturePlansForServiceType = (serviceType) => {
    const deferred = Q.defer();
    http.get('https://api.planningcenteronline.com/services/v2/service_types/' + serviceType.id + '/plans?filter=future')
      .then((res) => {
        deferred.resolve(res.data);
      })
      .done();
    return deferred.promise;
  };
}

module.exports = new Plans();
