const keys = require('./keys');

module.exports = {
  loadSchedules: () => {
    return (dispatch) => {
      window.apiClient.schedules.getSchedules()
        .then((res) => {
          dispatch({
            type: keys.LOAD_SCHEDULES,
            payload: {
              schedules: res.data,
            },
          });
        });
    };
  },
};
