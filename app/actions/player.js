module.exports = {
  playAttachment: (attachment) => {
    return (dispatch) => {
      window.apiClient.attachments.getAttachmentStreamUrl(attachment)
        .then((res) => {
          dispatch({
            type: 'PLAY_ATTACHMENT',
            payload: {
              selectedAttachmentUrl: res.data.attributes.attachment_url,
              playAudio: true,
            },
          });
        });
    };
  },
};
