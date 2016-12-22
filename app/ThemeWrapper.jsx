import React, { Component, PropTypes } from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CircularProgress from 'material-ui/CircularProgress';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import settings from '../lib/settings';

const theme = {
  palette: {
    primary1Color: '#2e2e2e',
    textColor: '#11629E',
  },
};

class ThemeWrapper extends Component {
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
    window.validateAuth().then(this.handleValidateAuthResponse);
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

  handleValidateAuthResponse = (valid) => {
    if (valid) {
      if (settings.getStoredSettings().fullPlayerUI) {
        this.context.router.replace('/full/schedules');
      } else {
        this.context.router.replace('/mini/schedules');
      }
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

  handleClickSettingsButton = () => {
    this.context.router.push('/app/settings');
  }

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
        {React.cloneElement(this.props.children, {
          key: this.props.location.pathname,
        })}
      </MuiThemeProvider>
    );
  }
}

export default ThemeWrapper;
