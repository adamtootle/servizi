import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import App from './App';

injectTapEventPlugin();

require('./css/app.scss');

window.renderApp = function renderApp() {
  ReactDOM.render(
    React.createElement(App),
    document.getElementById('app-wrapper')
  );
};
