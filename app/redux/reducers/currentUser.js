const keys = require('../actions/keys');

const initialState = {
  currentUser: null,
};

module.exports = function currentUserReducer(state = initialState, action) {
  switch (action.type) {
    case keys.CURRENT_USER_RELOADED:
      return Object.assign({}, state, action.payload);

    default:
      return state;
  }
};
