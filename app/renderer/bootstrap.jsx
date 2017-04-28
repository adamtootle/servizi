import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Routes from './Routes';

injectTapEventPlugin();

require('./css/app.scss');

window.renderApp = function renderApp() {
  ReactDOM.render(
    React.createElement(Routes),
    document.getElementById('app-wrapper')
  );
};
