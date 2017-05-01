const filter = require('lodash').filter;
const keys = require('./keys');

module.exports = {
  loadSchedules: () => {
    return (dispatch) => {
      window.apiClient.schedules.getSchedules()
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
      window.apiClient.plans.getPlan(planId)
      .then(window.apiClient.plans.getPlanItems)
      .then(window.apiClient.plans.getPlanAttachments)
      .then((res) => {
        const planAttachments = res.planAttachments;
        let newData = planAttachments.data;
        const items = filter(res.planItems.data, item => item.attributes.item_type === 'song');

        // if (!settings.getStoredSettings().fullPlayerUI) {
        //   filter(planAttachments.data, attachment => attachment.attributes.pco_type === 'AttachmentS3');
        // }
        //
        // if (this.context.uiRoutePrefix === 'full') {
        //   newData = planAttachments.data;
        // }
        // planAttachments.data = newData;
        dispatch({
          type: keys.SELECT_PLAN,
          payload: {
            currentPlan: res.plan,
            currentPlanItems: items,
            currentPlanAttachments: newData,
          },
        });
      });
    };
  },
};
