import React, { Component } from 'react';
import { HashRouter as Router, Route } from 'react-router-dom'
import { Login, SinglePlan, SchedulesList, SongsList, Settings } from './scenes';
import settings from '../lib/settings';
import AppWrapper from './AppWrapper';

export default class Routes extends Component {
  render() {
    const fullPlayerUI = settings.getStoredSettings().fullPlayerUI;
    return (
      <Router basename="/">
        <AppWrapper>
          <div id={fullPlayerUI ? 'full-player-inner' : 'mini-player-inner'}>
            <Route path="/login" component={Login} />
            <Route path="/plans" exact component={SchedulesList} />
            <Route path="/songs" component={SongsList} />
            <Route path="/plans/:planId" component={SinglePlan} />
            <Route path="/app/settings" component={Settings} />
          </div>
        </AppWrapper>
      </Router>
    );
  }
}

// <AppWrapper>
//   <Route path="login" component={LoginView} />
//   <Route path="schedules" component={SchedulesListView} />
//   <Route path="songs" component={SongsListView} />
//   <Route path="service_types/:service_type_id/plans/:plan_id" component={SinglePlanView} />
//   <Route path="app/settings" component={SettingsView} />
// </AppWrapper>
