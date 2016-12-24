import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './Routes';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

require('../css/app.scss');

window.renderApp = function renderApp() {
  ReactDOM.render(
    React.createElement(Routes),
    document.getElementById('app-wrapper')
  );
};
