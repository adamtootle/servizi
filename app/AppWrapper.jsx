import React, { Component, PropTypes } from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CircularProgress from 'material-ui/CircularProgress';
import { ipcRenderer } from 'electron';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import IconButton from 'material-ui/IconButton';
import FontAwesome from 'react-fontawesome';

const theme = {
  palette: {
    primary1Color: '#2e2e2e',
    textColor: '#11629E',
  },
};

class AppWrapper extends Component {
  static propTypes = {
    children: PropTypes.array,
    location: PropTypes.object,
  };

  static contextTypes = {
    router: PropTypes.object,
  };

  static childContextTypes = {
    playr: PropTypes.object,
  };

  static defaultProps = {};

  constructor(args) {
    super(args);

    this.state = {
      showLoader: true,
      showLogin: false,
      showApp: false,
      title: 'Playr',
      path: [],
      showBackButton: false,
    };
  }

  getChildContext() {
    return {
      playr: {
        setTitle: (title) => {
          this.setState({
            title,
          });
        },
        navigation: {
          showBackButton: () => {
            this.setState({
              showBackButton: true,
            });
          },
          hideBackButton: () => {
            this.setState({
              showBackButton: false,
            });
          },
        },
      },
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

  handleClickBackButton = () => {
    this.context.router.goBack();
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
          <div id="navbar">
            {(() => {
              if (this.state.showBackButton) {
                return (
                  <IconButton
                    iconClassName="fa fa-angle-left"
                    onClick={this.handleClickBackButton}
                  />
                );
              }
            })()}
            {this.state.title}
          </div>
          <ReactCSSTransitionGroup
            component="div"
            transitionName="example"
            transitionEnterTimeout={30000}
            transitionLeaveTimeout={30000}
          >
            {React.cloneElement(this.props.children, {
              key: this.props.location.pathname,
            })}
          </ReactCSSTransitionGroup>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default AppWrapper;
