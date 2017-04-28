import React, { Component, PropTypes } from 'react';
import { HashRouter as Router, Route } from 'react-router-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import SinglePlanView from './SinglePlanView';
import LoginView from './LoginView';
import SchedulesListView from './SchedulesListView';
import SongsListView from './SongsListView';
import SettingsView from './SettingsView';
import settings from '../lib/settings';
import Navbar from './Navbar';
import SideMenu from './SideMenu';
import AppWrapper from './AppWrapper';

const theme = {
  palette: {
    primary1Color: '#2e2e2e',
    textColor: '#11629E',
  },
};

export default class Routes extends Component {
  render() {
    const fullPlayerUI = settings.getStoredSettings().fullPlayerUI;
    return (
      <Router basename="/">
        <AppWrapper>
          <div>
            { fullPlayerUI ? <SideMenu /> : <Navbar /> }
            <Route path="/login" component={LoginView} />
            <Route path="/schedules" component={SchedulesListView} />
            <Route path="/songs" component={SongsListView} />
            <Route path="/service_types/:service_type_id/plans/:plan_id" component={SinglePlanView} />
            <Route path="/app/settings" component={SettingsView} />
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
