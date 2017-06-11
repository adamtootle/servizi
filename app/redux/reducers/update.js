const keys = require('../actions/keys');

const initialState = {
  updateAvailable: false,
  updateDownloaded: false,
  updateProgress: -1,
};

module.exports = function (state = initialState, action) {
  switch (action.type) {
    case keys.UPDATE_AVAILABLE:
      return Object.assign({}, state, { updateAvailable: true, updateInfo: action.payload });

    case keys.NO_UPDATE_AVAILABLE:
      return Object.assign({}, state, { updateAvailable: false });

    case keys.UPDATE_PROGRESS:
      return Object.assign({}, state, { updateProgress: action.payload });

    case keys.UPDATE_DOWNLOADED:
      return Object.assign({}, state, { updateProgress: -1, updateDownloaded: true });

    default:
      return state;
  }
};
