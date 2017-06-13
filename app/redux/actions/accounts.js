const keys = require('./keys');
const database = require('../../main/database');

module.exports = {
  loadStoredAccounts: () => (dispatch) => {
    database.findOne({
      key: 'accounts'
    }, (err, results) => {
      if (!results) {
        dispatch({
          type: keys.ACCOUNTS_LOADED,
          payload: [],
        });
      }

      dispatch({
        type: keys.ACCOUNTS_LOADED,
        payload: results,
      });
    });
  },

  handleLoadedAccounts: accounts => (dispatch) => {
    dispatch({
      type: keys.ACCOUNTS_LOADED,
      payload: accounts,
    });
  },
};
