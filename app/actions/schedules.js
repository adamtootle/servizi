const filter = require('lodash/filter');
const forEach = require('lodash/forEach');
const keys = require('./keys');
const pcoWrapper = require('../main/pco-wrapper');

module.exports = {
  loadSchedules: () => (dispatch) => {
    pcoWrapper.apiClient.schedules.getSchedules()
      .then((res) => {
        dispatch({
          type: keys.LOAD_SCHEDULES,
          payload: {
            schedules: res.data,
          },
        });
      });
  },
  selectPlan: planId => (dispatch) => {
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
    pcoWrapper.apiClient.reloadMe()
      .then((userResponse) => {
        pcoWrapper.apiClient.plans.getPlan(planId, userResponse.data.id)
        .then(pcoWrapper.apiClient.plans.getPlanItems)
        .then(pcoWrapper.apiClient.plans.getPlanAttachments)
        .then(pcoWrapper.apiClient.plans.getSkipFilter)
        .then((res) => {
          const items = filter(res.planItems, item => item.attributes.item_type === 'song');
          let planAttachments = [];

          forEach(items, (item) => {
            const songId = item.relationships.song.data.id;
            const itemAttachments = filter(res.planAttachments.data, attachment => attachment.relationships.attachable.data.id === songId);
            planAttachments = planAttachments.concat(itemAttachments);
          });

          dispatch({
            type: keys.HIDE_LOADER,
          });

          dispatch({
            type: keys.SELECT_PLAN,
            payload: {
              currentPlan: res.plan,
              currentPlanItems: res.planItems,
              currentPlanAttachments: res.planAttachments,
              currentPlanSkippedAttachments: res.skippedAttachments,
            },
          });
        });
      });
  },
};
