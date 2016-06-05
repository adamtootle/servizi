import React from 'react';
import ReactDOM from 'react-dom';
import AppWrapper from './AppWrapper';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { ipcRenderer } from 'electron';

injectTapEventPlugin();

const App = () => (
  <MuiThemeProvider muiTheme={getMuiTheme()}>
    <AppWrapper />
  </MuiThemeProvider>
);

const render = () => {
  ReactDOM.render(
    React.createElement(AppWrapper),
    document.getElementById('app')
  );
};

render();

ipcRenderer.on('login', (event, arg) => {
  console.log(arg); // prints "pong"
});