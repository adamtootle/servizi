import React, { Component, PropTypes } from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CircularProgress from 'material-ui/CircularProgress';
import Navbar from './Navbar';
import SideMenu from './SideMenu';
import PlayerControls from './PlayerControls';
import PlayerContext from './PlayerContext';
import settings from '../lib/settings';
import keys from '../lib/keys';
import { ipcRenderer } from 'electron';

const theme = {
  palette: {
    primary1Color: '#2e2e2e',
    textColor: '#11629E',
  },
};

class AppWrapper extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    location: PropTypes.object,
  };

  static contextTypes = {
    router: PropTypes.object,
  };

  static childContextTypes = {
    player: PropTypes.object,
  };

  static defaultProps = {};

  constructor(args) {
    super(args);

    this.state = {
      showLoader: true,
      showLogin: false,
      showApp: false,
      title: 'Playr',
      transitionDirection: 'push',
      selectedAttachment: null,
      playAudio: false,
    };

    this.playerContext = new PlayerContext();
    this.playerContext.setTitle = (title) => {
      this.setState({
        title,
      });
    };

    this.playerContext.on(keys.PlayAttachmentKey, (selectedAttachment) => {
      this.setState({
        selectedAttachment,
        playAudio: true,
      });
    });

    this.playerContext.on(keys.PlayPauseAttachmentKey, () => {
      this.setState({
        playAudio: !this.state.playAudio,
      });
    });

    ipcRenderer.on('MediaPlayPause', () => {
      this.playerContext.emit(keys.PlayPauseAttachmentKey);
    });

    ipcRenderer.on('MediaPreviousTrack', () => {
      this.playerContext.emit(keys.PlayPreviousAttachmentKey);
    });

    ipcRenderer.on('MediaNextTrack', () => {
      this.playerContext.emit(keys.PlayNextAttachmentKey);
    });
  }

  getChildContext() {
    this.playerContext.location = this.props.location;
    return {
      player: this.playerContext,
    };
  }

  componentDidMount() {
    window.validateAuth().then(this.handleValidateAuthResponse);
  }

  componentWillReceiveProps(props) {
    const newPathDepth = this.context.router.history.location.pathname.split('/').length - 1;
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
      this.context.router.history.replace('schedules');
    } else {
      this.context.router.history.replace('login');
    }

    this.setState({
      showLoader: false,
    });
  };

  handleLoginResults = () => {
    console.log('handleLoginResults');
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

    const fullPlayerUI = settings.getStoredSettings().fullPlayerUI;

    return (
      <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
        <div id="app" className={fullPlayerUI ? 'full-player' : 'mini-player'}>
          {(() => {
            if (fullPlayerUI) {
              return <SideMenu />;
            }

            return <Navbar />;
          })()}
          {React.cloneElement(this.props.children, {
            key: this.context.router.history.location.pathname,
          })}
          {(() => {
            if (fullPlayerUI) {
              return (
                <PlayerControls
                  selectedAttachment={this.state.selectedAttachment}
                  playAudio={this.state.playAudio}
                />
              );
            }

            return null;
          })()}
        </div>
      </MuiThemeProvider>
    );
  }
}

export default AppWrapper;
