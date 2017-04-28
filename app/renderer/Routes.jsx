import React, { Component } from 'react';
import { HashRouter as Router, Route } from 'react-router-dom'
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux'
import { electronEnhancer } from 'redux-electron-store';
import { Login, SinglePlan, SchedulesList, SongsList, Settings } from './scenes';
import reducers from '../reducers/renderer';
import settings from '../main/settings';
import AppWrapper from './AppWrapper';
import PlayerControls from './components/PlayerControls';

let storeDispatch;
const enhancer = compose(
  applyMiddleware(thunk),
  electronEnhancer({
    dispatchProxy: a => storeDispatch(a),
  })
);

const store = createStore(combineReducers(reducers), {}, enhancer);
storeDispatch = store.dispatch;

export default class Routes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedAttachment: null,
      playAudio: false,
    };
  }
  render() {
    const fullPlayerUI = settings.getStoredSettings().fullPlayerUI;
    return (
      <Provider store={store}>
        <Router basename="/">
          <AppWrapper>
            <div id={fullPlayerUI ? 'full-player-inner' : 'mini-player-inner'}>
              <Route path="/login" component={Login} />
              <Route path="/plans" exact component={SchedulesList} />
              <Route path="/songs" component={SongsList} />
              <Route path="/plans/:planId" component={SinglePlan} />
              <Route path="/app/settings" component={Settings} />
            </div>
            <PlayerControls
              selectedAttachment={this.state.selectedAttachment}
              playAudio={this.state.playAudio}
            />
          </AppWrapper>
        </Router>
      </Provider>
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
