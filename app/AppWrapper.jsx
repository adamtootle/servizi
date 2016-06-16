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
      pathDepth: 1,
      transitionDirection: 'push',
    };

    this.playrContext = {
      setTitle: (title) => {
        this.setState({
          title,
        });
      },
    };
  }

  getChildContext() {
    return {
      playr: this.playrContext,
    };
  }

  componentDidMount() {
    ipcRenderer.on('validateAuth', this.handleValidateAuthResponse);
    ipcRenderer.send('validateAuth');
    ipcRenderer.on('didLogin', this.handleLoginResults);
  }

  componentWillReceiveProps(props) {
    const newPathDepth = props.location.pathname.split('/').length - 1;
    let transitionDirection;
    if (newPathDepth > this.state.pathDepth) {
      transitionDirection = 'push';
    } else {
      transitionDirection = 'pop';
    }
    this.setState({
      pathDepth: newPathDepth,
      transitionDirection,
      player: {
        timestamp: '',
      },
    });
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
              if (this.state.pathDepth > 1) {
                return (
                  <IconButton
                    iconClassName="fa fa-chevron-left"
                    onClick={this.handleClickBackButton}
                    className="navbar-back-button"
                  />
                );
              }

              return <span />;
            })()}
            {this.state.title}
          </div>
          <div id="player-controls">
            <div id="player-progress-indicator">
            </div>
            <div id="player-timestamp">
              {this.state.player.timestamp}
            </div>
          </div>
          <ReactCSSTransitionGroup
            component="div"
            transitionName={`transition-${this.state.transitionDirection}`}
            transitionEnterTimeout={300}
            transitionLeaveTimeout={300}
          >
            <div id="app-wrapper-inner">
              {React.cloneElement(this.props.children, {
                key: this.props.location.pathname,
              })}
            </div>
          </ReactCSSTransitionGroup>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default AppWrapper;
