import React, { Component } from 'react';
import { Router, Route, hashHistory } from 'react-router';
import AppWrapper from './AppWrapper';
import SinglePlanView from './SinglePlanView';
import LoginView from './LoginView';
import SchedulesListView from './SchedulesListView';
import SongsListView from './SongsListView';
import SettingsView from './SettingsView';

class Routes extends Component {
  render() {
    return (
      <Router history={hashHistory}>
        <Route path="/" component={AppWrapper}>
          <Route path="login" component={LoginView} />
          <Route path="schedules" component={SchedulesListView} />
          <Route path="songs" component={SongsListView} />
          <Route path="service_types/:service_type_id/plans/:plan_id" component={SinglePlanView} />
          <Route path="app/settings" component={SettingsView} />
        </Route>
      </Router>
    );
  }
}

export default Routes;
