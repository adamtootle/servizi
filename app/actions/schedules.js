const filter = require('lodash/filter');
const forEach = require('lodash/forEach');
const keys = require('./keys');
const pcoWrapper = require('../main/pco-wrapper');

module.exports = {
  loadSchedules: () => {
    return (dispatch) => {
      pcoWrapper.apiClient.schedules.getSchedules()
        .then((res) => {
          dispatch({
            type: keys.LOAD_SCHEDULES,
            payload: {
              schedules: res.data,
            },
          });
        });
    };
  },
  selectPlan: (planId) => {
    return (dispatch) => {
      dispatch({
        type: keys.SELECT_PLAN,
        payload: {
          currentPlan: null,
          currentPlanItems: [],
          currentPlanAttachments: [],
        },
      });
      dispatch({
        type: keys.SHOW_LOADER,
      });
      pcoWrapper.apiClient.plans.getPlan(planId)
      .then(pcoWrapper.apiClient.plans.getPlanItems)
      .then(pcoWrapper.apiClient.plans.getPlanAttachments)
      .then((res) => {
        const items = filter(res.planItems.data, item => item.attributes.item_type === 'song');
        var planAttachments = [];

        forEach(items, (item) => {
          const songId = item.relationships.song.data.id
          const itemAttachments = filter(res.planAttachments.data, (attachment) => {
            return attachment.relationships.attachable.data.id === songId;
          });
          planAttachments = planAttachments.concat(itemAttachments);
        });

        dispatch({
          type: keys.HIDE_LOADER,
        });

        dispatch({
          type: keys.SELECT_PLAN,
          payload: {
            currentPlan: res.plan,
            currentPlanItems: items,
            currentPlanAttachments: planAttachments,
          },
        });
      });
    };
  },
};
