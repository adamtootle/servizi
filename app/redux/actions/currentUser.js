const keys = require('./keys');
const pcoWrapper = require('../../main/pco-wrapper');

module.exports = {
  reloadCurrentUser: () => (dispatch) => {
    pcoWrapper.apiClient.reloadMe()
      .then((res) => {
        dispatch({
          type: keys.CURRENT_USER_RELOADED,
          payload: res.data,
        });
      });
  },
};
