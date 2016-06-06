import React, { Component, PropTypes } from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CircularProgress from 'material-ui/CircularProgress';
import { ipcRenderer } from 'electron';

const theme = {
  palette: {
    primary1Color: '#2e2e2e',
    textColor: '#11629E',
  },
};

class AppWrapper extends Component {
  static propTypes = {
    children: PropTypes.array,
  };

  static contextTypes = {
    router: PropTypes.object,
  };

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
    ipcRenderer.on('didLogin', this.handleLoginResults);
  }

  handleValidateAuthResponse = (ev, valid) => {
    if (valid) {
      this.context.router.replace('/plans');
    } else {
      this.context.router.replace('/login');
    }

    this.setState({
      showLoader: false,
    });
  };

  handleLoginResults = () => {
    console.log('handleLoginResults');
  };

  render() {
    console.log(this.props.children);
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
          {this.props.children}
        </div>
      </MuiThemeProvider>
    );
  }
}

export default AppWrapper;
