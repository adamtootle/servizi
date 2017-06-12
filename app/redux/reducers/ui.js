const keys = require('../actions/keys');

const initialState = {
  showLoader: false,
};

module.exports = function uiReducer(state = initialState, action) {
  switch (action.type) {
    case keys.SHOW_LOADER:
      return Object.assign({}, state, { showLoader: true });

    case keys.HIDE_LOADER:
      return Object.assign({}, state, { showLoader: false });

    default:
      return state;
  }
};
