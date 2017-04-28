const initialState = {};

module.exports = function (state = initialState, action) {
  switch (action.type) {
    case 'PLAY_ATTACHMENT':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
