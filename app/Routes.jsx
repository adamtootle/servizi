import React, { Component } from 'react';
import { Router, Route, hashHistory } from 'react-router';
import ThemeWrapper from './ThemeWrapper';
import MiniPlayerWrapper from './MiniPlayerWrapper';
import FullPlayerWrapper from './FullPlayerWrapper';
import SinglePlanView from './SinglePlanView';
import LoginView from './LoginView';
import SchedulesListView from './SchedulesListView';
import SettingsView from './SettingsView';

class Routes extends Component {
  render() {
    return (
      <Router history={hashHistory}>
        <Route path="/" component={ThemeWrapper}>
          <Route path="mini" component={MiniPlayerWrapper}>
            <Route path="login" component={LoginView} />
            <Route path="schedules" component={SchedulesListView} />
            <Route path="service_types/:service_type_id/plans/:plan_id" component={SinglePlanView} />
            <Route path="app/settings" component={SettingsView} />
          </Route>
          <Route path="full" component={FullPlayerWrapper}>
            <Route path="login" component={LoginView} />
            <Route path="schedules" component={SchedulesListView} />
            <Route path="service_types/:service_type_id/plans/:plan_id" component={SinglePlanView} />
            <Route path="app/settings" component={SettingsView} />
          </Route>
        </Route>
      </Router>
    );
  }
}

export default Routes;
