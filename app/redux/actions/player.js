const findIndex = require('lodash/findIndex');
const find = require('lodash/find');
const findLast = require('lodash/findLast');
const keys = require('./keys');
const pcoWrapper = require('../../main/pco-wrapper');

function dispatchAndLoadAttachment(attachment, dispatch) {
  dispatch({
    type: keys.PLAY_ATTACHMENT,
    payload: {
      selectedAttachment: attachment,
      playAudio: false,
      currentSecond: 0,
      totalSeconds: 0,
    },
  });
  pcoWrapper.apiClient.services.attachments.getAttachmentStreamUrl(attachment)
    .then((res) => {
      dispatch({
        type: keys.PLAY_ATTACHMENT,
        payload: {
          selectedAttachmentUrl: res.data.attributes.attachment_url,
          playAudio: true,
        },
      });
    });
}
function playAttachment(attachment) {
  return (dispatch) => {
    dispatchAndLoadAttachment(attachment, dispatch);
  };
}

module.exports = {
  playAttachment,
  playPauseAttachment: () => ({
    type: keys.PLAY_PAUSE_ATTACHMENT,
  }),
  currentAttachmentTime: args => ({
    type: keys.CURRENT_ATTACHMENT_TIME,
    payload: args,
  }),
  previousAttachment: () => (dispatch, getState) => {
    const state = getState();
    const { player, plans } = state;
    if (state.player.currentSecond > 5) {
      dispatch({ type: keys.RESTART_CURRENT_ATTACHMENT });
    } else {
      const selectedAttachment = player.selectedAttachment;
      const attachments = plans.flattenedAttachments;
      const selectedAttachmentIndex = findIndex(attachments, attachment => attachment.id === selectedAttachment.id);

      const isFirstAttachment = selectedAttachmentIndex === 0;
      let nextAttachment;
      if (isFirstAttachment) {
        nextAttachment = findLast(plans.flattenedAttachments, (attachment) => {
          return !attachment.skipped;
        });
      } else {
        nextAttachment = findLast(plans.flattenedAttachments, (attachment, index) => {
          return index < selectedAttachmentIndex && !attachment.skipped;
        });
      }

      dispatchAndLoadAttachment(nextAttachment, dispatch);
    }
  },
  nextAttachment: () => (dispatch, getState) => {
    const state = getState();
    const { player, plans } = state;
    const selectedAttachment = player.selectedAttachment;
    const selectedAttachmentIndex = findIndex(plans.flattenedAttachments, attachment => attachment.id === selectedAttachment.id);

    const isLastAttachment = selectedAttachmentIndex === plans.flattenedAttachments.length - 1;
    let nextAttachment;
    if (isLastAttachment) {
      nextAttachment = find(plans.flattenedAttachments, (attachment) => {
        return !attachment.skipped;
      });
    } else {
      nextAttachment = find(plans.flattenedAttachments, (attachment, index) => {
        return index > selectedAttachmentIndex && !attachment.skipped;
      });
    }
    dispatchAndLoadAttachment(nextAttachment, dispatch);
  },
  repeat: () => ({
    type: keys.REPEAT_ATTACHMENT,
  }),
  attachmentEnded: () => ({
    type: keys.ATTACHMENT_ENDED,
  }),
  didRestartCurrentAttachment: () => ({
    type: keys.DID_RESTART_CURRENT_ATTACHMENT,
  }),
};
