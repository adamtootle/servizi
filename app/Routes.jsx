import React, { Component } from 'react';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import AppWrapper from './AppWrapper';
import PlansListView from './PlansListView';
import LoginView from './LoginView';

class Routes extends Component {
  render() {
    return (
      <Router history={hashHistory}>
        <Route path="/" component={AppWrapper}>
          <Route path="login" component={LoginView} />
          <Route path="plans" component={PlansListView} />
        </Route>
      </Router>
    );
  }
}

export default Routes;
