const keys = require('../actions/keys');

const initialState = {
  playAudio: false,
  currentSecond: 0,
  totalSeconds: 0,
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

    default:
      return state;
  }
};
