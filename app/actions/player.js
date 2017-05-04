const findIndex = require('lodash/findIndex');
const keys = require('./keys');
const pcoWrapper = require('../main/pco-wrapper');

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
  pcoWrapper.apiClient.attachments.getAttachmentStreamUrl(attachment)
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
  playPauseAttachment: () => {
    return {
      type: keys.PLAY_PAUSE_ATTACHMENT,
    };
  },
  currentAttachmentTime: (args) => {
    return {
      type: keys.CURRENT_ATTACHMENT_TIME,
      payload: args,
    };
  },
  previousAttachment: () => {
    return (dispatch, getState) => {
      const state = getState();
      if (state.player.currentSecond > 5) {
        dispatch({ type: keys.RESTART_CURRENT_ATTACHMENT });
      } else {
        const selectedAttachment = state.player.selectedAttachment;
        const attachments = state.plans.currentPlanAttachments;
        const selectedAttachmentIndex = findIndex(attachments, (attachment) => {
          return attachment.id === selectedAttachment.id;
        });

        const attachmentsLength = state.plans.currentPlanAttachments.length;
        let newAttachment;
        if (selectedAttachmentIndex === 0) {
          newAttachment = state.plans.currentPlanAttachments[attachmentsLength - 1];
        } else {
          newAttachment = state.plans.currentPlanAttachments[selectedAttachmentIndex - 1];
        }
        dispatchAndLoadAttachment(newAttachment, dispatch);
      }
    };
  },
  nextAttachment: () => {
    return (dispatch, getState) => {
      const state = getState();
      const selectedAttachment = state.player.selectedAttachment;
      const selectedAttachmentIndex = findIndex(state.plans.currentPlanAttachments, (attachment) => {
        return attachment.id === selectedAttachment.id;
      });

      let newAttachment;
      if (selectedAttachmentIndex === state.plans.currentPlanAttachments.length - 1) {
        newAttachment = state.plans.currentPlanAttachments[0];
      } else {
        newAttachment = state.plans.currentPlanAttachments[selectedAttachmentIndex + 1];
      }
      dispatchAndLoadAttachment(newAttachment, dispatch);
    };
  },
  repeat: () => {
    return {
      type: keys.REPEAT_ATTACHMENT,
    };
  },
  attachmentEnded: () => {
    return {
      type: keys.ATTACHMENT_ENDED,
    };
  },
  didRestartCurrentAttachment: () => {
    return {
      type: keys.DID_RESTART_CURRENT_ATTACHMENT,
    };
  },
};
