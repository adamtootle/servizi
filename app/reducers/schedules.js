const keys = require('../actions/keys');

const initialState = {
  schedules: [],
};

module.exports = function (state = initialState, action) {
  switch (action.type) {
    case keys.LOAD_SCHEDULES:
      return Object.assign({}, state, action.payload);

    default:
      return state;
  }
};
