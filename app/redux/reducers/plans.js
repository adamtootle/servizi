const keys = require('../actions/keys');

const initialState = {
  currentPlan: null,
  currentPlanItems: [],
  currentPlanAttachments: [],
};

module.exports = function plansReducer(state = initialState, action) {
  switch (action.type) {
    case keys.LOAD_PLANS:
      return Object.assign({}, state, action.payload);

    case keys.SELECT_PLAN:
      return Object.assign({}, state, action.payload);

    default:
      return state;
  }
};
