import React, { Component } from 'react';
import { Router, Route, hashHistory } from 'react-router';
import AppWrapper from './AppWrapper';
import SinglePlanView from './SinglePlanView';
import LoginView from './LoginView';
import SchedulesListView from './SchedulesListView';

class Routes extends Component {
  render() {
    return (
      <Router history={hashHistory}>
        <Route path="/" component={AppWrapper}>
          <Route path="login" component={LoginView} />
          <Route path="schedules" component={SchedulesListView} />
          <Route path="service_types/:service_type_id/plans/:plan_id" component={SinglePlanView} />
        </Route>
      </Router>
    );
  }
}

export default Routes;
