const keys = require('../actions/keys');

const initialState = {
  playAudio: false,
  currentSecond: 0,
  totalSeconds: 0,
  repeat: false,
};

module.exports = function (state = initialState, action) {
  switch (action.type) {
    case keys.PLAY_ATTACHMENT:
      return Object.assign({}, state, action.payload);

    case keys.PLAY_PAUSE_ATTACHMENT:
      return Object.assign({}, state, {
        playAudio: !state.playAudio,
      });

    case keys.CURRENT_ATTACHMENT_TIME:
      return Object.assign({}, state, action.payload);

    case keys.PREVIOUS_ATTACHMENT:
      return state;

    case keys.NEXT_ATTACHMENT:
      return state;

    case keys.REPEAT_ATTACHMENT:
      return Object.assign({}, state, {
        repeat: !state.repeat,
      });

    case keys.RESTART_CURRENT_ATTACHMENT:
      return Object.assign({}, state, {
        restartCurrentAttachment: true,
      });

    case keys.DID_RESTART_CURRENT_ATTACHMENT:
      return Object.assign({}, state, {
        restartCurrentAttachment: false,
      });

    default:
      return state;
  }
};
