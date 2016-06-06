const Q = require('q');
const http = require('./http');
const services = require('./services');
const forEach = require('lodash/foreach');

function Plans() {
  this.getFuturePlans = () => {
    const deferred = Q.defer();
    getSchedules()
      .then((res) => {
        const promises = res.map((schedule) => {
          return getFuturePlansForSchedule(schedule);
        });
        deferred.resolve(Q.all(promises));
      });
    // services.getServiceTypes()
    //   .then((serviceTypes) => {
    //     const promises = serviceTypes.map((serviceType) => {
    //       return this.getFuturePlansForServiceType(serviceType);
    //     });
    //     return Q.all(promises)
    //   })
    //   .then((results) => {
    //     const res = results.reduce((prev, current) => {
    //       if (prev === undefined) { return current; }
    //       return prev.concat(current);
    //     })
    //     deferred.resolve(res);
    //   })
    //   .catch((err) => {
    //     deferred.reject(err);
    //   });
    return deferred.promise;
  };

  // this.getFuturePlansForServiceType = (serviceType) => {
  //   const deferred = Q.defer();
  //   http.get('https://api.planningcenteronline.com/services/v2/service_types/' + serviceType.id + '/plans?filter=future')
  //     .then((res) => {
  //       deferred.resolve(res.data);
  //     })
  //     .catch((err) => {
  //       deferred.reject(err);
  //     });
  //   return deferred.promise;
  // };

  //
  // private methods
  //

  function getSchedules() {
    const deferred = Q.defer();
    http.get('https://api.planningcenteronline.com/services/v2/me/schedules')
      .then((res) => {
        deferred.resolve(res.data);
      })
      .catch((err) => {
        deferred.reject(err);
      });
    return deferred.promise;
  }

  function getFuturePlansForSchedule(schedule) {
    const deferred = Q.defer();
    http.get(`https://api.planningcenteronline.com/services/v2/service_types/${schedule.relationships.service_type.data.id}/plans?filter=future`)
      .then((res) => {
        const promises = res.data.map((plan) => {
          return Q.fcall(() => {
            return getPlanItems(schedule, plan)
              .then(() => {
                return getPlanAttachments(schedule, plan);
              });
          });
        });
        return Q.all(promises);
      })
      .then((plans) => {
        deferred.resolve({
          schedule,
          plans: plans,
        });
      })
      .catch((err) => {
        deferred.reject(err);
      });
    return deferred.promise;
  }

  function getPlanItems(schedule, plan) {
    const deferred = Q.defer();
    http.get(`https://api.planningcenteronline.com/services/v2/service_types/${schedule.relationships.service_type.data.id}/plans/${plan.id}/items`)
      .then((res) => {
        plan.items = res.data;
        deferred.resolve(plan);
      })
      .catch((err) => {
        deferred.reject(err);
      });
    return deferred.promise;
  }

  function getPlanAttachments(schedule, plan) {
    const deferred = Q.defer();
    http.get(`https://api.planningcenteronline.com/services/v2/service_types/${schedule.relationships.service_type.data.id}/plans/${plan.id}/attachments`)
      .then((res) => {
        plan.attachments = res.data;
        deferred.resolve(plan);
      })
      .catch((err) => {
        deferred.reject(err);
      });
    return deferred.promise;
  }
}

module.exports = new Plans();
