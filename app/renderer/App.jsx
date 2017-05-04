import React, { Component, PropTypes } from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CircularProgress from 'material-ui/CircularProgress';
import { ipcRenderer } from 'electron';
import { HashRouter as Router, Route, Redirect } from 'react-router-dom';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { electronEnhancer } from 'redux-electron-store';
import ReactPlayer from 'react-player';
import Navbar from './components/Navbar';
import SideMenu from './components/SideMenu';
import PlayerContext from './PlayerContext';
import settings from '../main/settings';
import keys from '../main/keys';
import { Login, SinglePlan, Plans, SongsList, Settings } from './scenes';
import reducers from '../reducers';
import PlayerControls from './components/PlayerControls';
import { player as playerActions } from '../actions';

const theme = {
  palette: {
    primary1Color: '#2e2e2e',
    textColor: '#11629E',
  },
};

let storeDispatch;
const enhancer = compose(
  applyMiddleware(thunk),
  electronEnhancer({
    filter: true,
    dispatchProxy: a => storeDispatch(a),
  })
);

const store = createStore(combineReducers(reducers), {}, enhancer);
storeDispatch = store.dispatch;

export default class App extends Component {
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

    this.state = store.getState();

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

    store.subscribe(() => {
      const newState = store.getState();
      this.setState(newState);
      if (newState.player.restartCurrentAttachment) {
        this.player.seekTo(0);
        store.dispatch(playerActions.didRestartCurrentAttachment());
      }
    });
  }

  componentDidMount() {
    window.validateAuth().then(this.handleValidateAuthResponse);
  }

  handleValidateAuthResponse = (valid) => {
    if (valid) {
      this.setState({
        hasValidAuth: true,
      });
    } else {
      this.setState({
        hasValidAuth: false,
      });
    }
  };

  handleLoginResults = () => {
    console.log('handleLoginResults');
  };

  handlePlayerProgressUpdate = (progress) => {
    if (this.state.player.totalSeconds > 0 && progress.played !== undefined) {
      const currentSecond = Math.floor(this.state.player.totalSeconds * progress.played);
      store.dispatch(playerActions.currentAttachmentTime({ currentSecond }));
    }
  };

  handlePlayerDurationUpdate = (totalSeconds) => {
    store.dispatch(playerActions.currentAttachmentTime({ totalSeconds }));
  };

  handlePlayerEnded = () => {
    if (this.state.player.repeat) {
      this.player.seekTo(0);
    }
  };

  selectedAttachmentTypeClassName = () => {
    const fullPlayerUI = settings.getStoredSettings().fullPlayerUI;

    let className = fullPlayerUI ? 'full-player' : 'mini-player';

    if (this.state.player.playAudio) {
      className += ' playing';
    }

    if (this.state.player.selectedAttachment) {
      if (this.state.player.selectedAttachment.attributes.pco_type === 'AttachmentS3') {
        className += ' audio-player';
      } else {
        className += ' video-player';
      }
    }

    return className;
  };

  currentPlayerStyles = () => {
    if (this.state.player.selectedAttachment
        && this.state.player.selectedAttachment.attributes.pco_type === 'AttachmentS3') {
      return {
        position: 'absolute',
        top: 9999,
      };
    }

    return {};
  };

  currentPlayerHeight = () => {
    if (this.state.player.selectedAttachment
        && this.state.player.selectedAttachment.attributes.pco_type === 'AttachmentS3') {
      return '0px';
    }

    return '400px';
  };

  render() {
    const fullPlayerUI = settings.getStoredSettings().fullPlayerUI;

    return (
      <Provider store={store}>
        <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
          <Router basename="/">
            <div
              id="app"
              className={this.selectedAttachmentTypeClassName()}
            >
              {
                fullPlayerUI ?
                  <SideMenu />
                  : <Navbar />
              }
              <div id={fullPlayerUI ? 'full-player-inner' : 'mini-player-inner'} >
                <div id="media-player-container">
                  <ReactPlayer
                    ref={(ref) => { this.player = ref; }}
                    style={this.currentPlayerStyles()}
                    url={this.state.player.selectedAttachmentUrl}
                    progressFrequency={500}
                    playing={this.state.player.playAudio}
                    volume={1}
                    width="100%"
                    height={this.currentPlayerHeight()}
                    onProgress={this.handlePlayerProgressUpdate}
                    onDuration={this.handlePlayerDurationUpdate}
                    onEnded={this.handlePlayerEnded}
                    youtubeConfig={{
                      playerVars: {
                        controls: 1,
                      },
                    }}
                  />
                </div>
                <div id="routes-wrapper">
                  {
                    this.state.ui.showLoader ?
                      <div className="loading-indicator-wrapper">
                        <CircularProgress />
                      </div>
                      : null
                  }
                  <Route path="/login" component={Login} />
                  <Route path="/plans" exact component={Plans} />
                  <Route path="/songs" component={SongsList} />
                  <Route path="/plans/:planId" component={SinglePlan} />
                  <Route path="/app/settings" component={Settings} />
                </div>
              </div>
              {
                this.state.player.selectedAttachment
                && this.state.player.selectedAttachment.attributes.pco_type === 'AttachmentS3' ?
                  <PlayerControls playerRef={this.player} />
                  : null
              }
            </div>
          </Router>
        </MuiThemeProvider>
      </Provider>
    );
  }
}
