const keys = require('../actions/keys');

const initialState = {};

module.exports = function (state = initialState, action) {
  switch (action.type) {
    case keys.LOAD_PLANS:
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
};
