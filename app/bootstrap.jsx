import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './Routes';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

const render = () => {
  ReactDOM.render(
    React.createElement(Routes),
    document.getElementById('app')
  );
};

render();
