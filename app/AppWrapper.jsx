import React, { Component } from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CircularProgress from 'material-ui/CircularProgress';
import LoginView from './LoginView';
import { ipcRenderer } from 'electron';

const theme = {
  palette: {
    primary1Color: '#2e2e2e',
    textColor: '#11629E',
  },
};

class AppWrapper extends Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(args) {
    super(args);

    this.state = {
      showLoader: true,
      showLogin: false,
      showApp: false,
    };
  }

  componentDidMount() {
    ipcRenderer.on('validateAuth', this.handleValidateAuthResponse);
    ipcRenderer.send('validateAuth');
  }

  handleValidateAuthResponse = (ev, valid) => {
    console.log(valid);
    if (valid) {
      this.setState({
        showLoader: false,
        showLogin: false,
        showApp: true,
      });
    } else {
      this.setState({
        showLoader: false,
        showLogin: true,
        showApp: false,
      });
    }
    setTimeout(() => {
      console.log(this.state);
    }, 10);
  };

  render() {
    if (this.state.showLoader) {
      return (
        <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
          <div className="loading-indicator-wrapper">
            <CircularProgress />
          </div>
        </MuiThemeProvider>
      );
    }

    return (
      <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
        <div id="app-wrapper">
          {(() => {
            if (this.state.showApp) {
              return <div />;
            }

            return <LoginView />;
          })()}
        </div>
      </MuiThemeProvider>
    );
  }
}

export default AppWrapper;
