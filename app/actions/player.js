const keys = require('./keys');

module.exports = {
  playAttachment: (attachment) => {
    return (dispatch) => {
      dispatch({
        type: keys.PLAY_ATTACHMENT,
        payload: {
          selectedAttachment: attachment,
          playAudio: false,
          currentSecond: 0,
          totalSeconds: 0,
        },
      });
      window.apiClient.attachments.getAttachmentStreamUrl(attachment)
        .then((res) => {
          dispatch({
            type: keys.PLAY_ATTACHMENT,
            payload: {
              selectedAttachmentUrl: res.data.attributes.attachment_url,
              playAudio: true,
            },
          });
        });
    };
  },
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
};
