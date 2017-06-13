const keys = require('../actions/keys');

const initialState = [];

module.exports = function accountsReducer(state = initialState, action) {
  switch (action.type) {
    case keys.ACCOUNTS_LOADED:
      return action.payload;

    default:
      return state;
  }
};
