const keys = require('../actions/keys');

const initialState = {
  schedules: [],
  currentPlan: null,
  currentPlanItems: [],
  currentPlanAttachments: [],
};

module.exports = function (state = initialState, action) {
  switch (action.type) {
    case keys.LOAD_SCHEDULES:
      return Object.assign({}, state, action.payload);

    case keys.SELECT_PLAN:
      return Object.assign({}, state, action.payload);

    default:
      return state;
  }
};
