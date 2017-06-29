const filter = require('lodash/filter');
const forEach = require('lodash/forEach');
const flatMap = require('lodash/flatMap');
const sortBy = require('lodash/sortBy');
const Promise = require('bluebird');
const keys = require('./keys');
const pcoWrapper = require('../../main/pco-wrapper');
const attachmentIsSupported = require('../../helpers/attachmentIsSupported');

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
    dispatch({
      type: keys.SHOW_LOADER,
    });
    dispatch({
      type: keys.SELECT_PLAN,
      payload: {
        currentPlan: null,
        itemsAndAttachments: [],
        flattenedAttachments: [],
      },
    });
    const { currentUser } = getState();
    pcoWrapper.apiClient.reloadMe()
      .then((userResponse) => {
        pcoWrapper.apiClient.services.plans.get(planId)
          .then((plan) => {
            Promise.all([
              pcoWrapper.apiClient.services.plans.getItems(plan),
              pcoWrapper.apiClient.services.plans.getAttachments(plan),
            ]).then((itemsAndAttachmentsResponse) => {
              pcoWrapper.apiClient.services.plans.getSkipFilter({ plan, user: currentUser, attachments: itemsAndAttachmentsResponse[1] })
                .then((skippedAttachmentsResponse) => {
                  const itemsAndAttachments = [];
                  const songItems = filter(itemsAndAttachmentsResponse[0], item => item.attributes.item_type === 'song');
                  const skippedAttachmentIds = skippedAttachmentsResponse.map(skippedAttachment => skippedAttachment.relationships.attachment.data.id);

                  const attachmentsWithSkips = itemsAndAttachmentsResponse[1].map((attachment) => {
                    const skipped = skippedAttachmentIds.indexOf(attachment.id) !== -1;
                    return Object.assign({}, attachment, { skipped });
                  });

                  forEach(songItems, (item) => {
                    const attachments = filter(attachmentsWithSkips, (attachment) => {
                      const attachmentAttachableType = attachment.relationships.attachable.data.type;
                      const attachmentAttachableId = attachment.relationships.attachable.data.id;
                      const attachmentIsForItem = attachmentAttachableId === item.relationships[attachmentAttachableType.toLowerCase()].data.id;
                      return attachmentIsForItem && attachmentIsSupported(attachment);
                    });

                    itemsAndAttachments.push({
                      item,
                      attachments: sortBy(attachments, attachment => attachment.skipped),
                    });
                  });

                  dispatch({
                    type: keys.HIDE_LOADER,
                  });

                  dispatch({
                    type: keys.SELECT_PLAN,
                    payload: {
                      currentPlan: plan,
                      itemsAndAttachments,
                      flattenedAttachments: flatMap(itemsAndAttachments.map(obj => obj.attachments)),
                    },
                  });
                });
            });
          });
      });
  },
};
