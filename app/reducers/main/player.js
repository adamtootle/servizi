const initialState = {};

module.exports = function(state = initialState, action) {
  console.log('main action', action);
  return state;
};
