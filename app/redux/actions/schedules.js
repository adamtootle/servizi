const filter = require('lodash/filter');
const forEach = require('lodash/forEach');
const Promise = require('bluebird');
const keys = require('./keys');
const pcoWrapper = require('../../main/pco-wrapper');

module.exports = {
  loadSchedules: () => (dispatch) => {
    pcoWrapper.apiClient.services.schedules.getSchedules()
      .then((res) => {
        dispatch({
          type: keys.LOAD_SCHEDULES,
          payload: {
            schedules: res.data,
          },
        });
        dispatch({
          type: keys.HIDE_LOADER,
        });
      });
  },

  selectPlan: planId => (dispatch, getState) => {
    const { currentUser } = getState();
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
        pcoWrapper.apiClient.services.plans.get(planId)
          .then((plan) => {
            Promise.all([
              pcoWrapper.apiClient.services.plans.getItems(plan),
              pcoWrapper.apiClient.services.plans.getAttachments(plan),
            ]).then((itemsAndAttachments) => {
              pcoWrapper.apiClient.services.plans.getSkipFilter({ plan, user: currentUser, attachments: itemsAndAttachments[1] })
                .then((skippedAttachments) => {
                  const items = filter(itemsAndAttachments[0], item => item.attributes.item_type === 'song');
                  let planAttachments = [];

                  forEach(items, (item) => {
                    const songId = item.relationships.song.data.id;
                    const itemAttachments = filter(itemsAndAttachments[1], attachment => attachment.relationships.attachable.data.id === songId);
                    planAttachments = planAttachments.concat(itemAttachments);
                  });

                  dispatch({
                    type: keys.HIDE_LOADER,
                  });

                  dispatch({
                    type: keys.SELECT_PLAN,
                    payload: {
                      currentPlan: plan,
                      currentPlanItems: itemsAndAttachments[0],
                      currentPlanAttachments: itemsAndAttachments[1],
                      currentPlanSkippedAttachments: skippedAttachments,
                    },
                  });
                });
            });
          });
      });
  },
};
