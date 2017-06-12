import React, { Component, PropTypes } from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CircularProgress from 'material-ui/CircularProgress';
import { ipcRenderer, remote as electronRemote } from 'electron';
import { HashRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import ReactPlayer from 'react-player';
import Promise from 'bluebird';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import LinearProgress from 'material-ui/LinearProgress';
import settings from '../main/settings';
import { Login, SinglePlan, Plans, SongsList, Settings, LoggedIn } from './scenes';
import PlayerControls from './components/PlayerControls';
import { player as playerActions, currentUser as currentUserActions } from '../redux/actions';
import pcoWrapper from '../main/pco-wrapper';
import auth from '../main/auth';
import store from '../main/redux-store';
import reduxActionKeys from '../redux/actions/keys';
import database from '../main/database';

const theme = {
  palette: {
    primary1Color: '#2e2e2e',
    textColor: '#11629E',
  },
};

// let storeDispatch;
// const enhancer = compose(
//   applyMiddleware(thunk),
//   electronEnhancer({
//     filter: true,
//     dispatchProxy: a => storeDispatch(a),
//   })
// );

// const store = createStore(combineReducers(reducers), {}, enhancer);
// storeDispatch = store.dispatch;

export default class App extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
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

    this.state = Object.assign({}, store.getState());

    store.subscribe(() => {
      const newState = store.getState();
      this.setState(newState);
      if (newState.player.restartCurrentAttachment) {
        this.player.seekTo(0);
        store.dispatch(playerActions.didRestartCurrentAttachment());
      }
    });

    pcoWrapper.apiClient.on('error', (err) => {
      if (err.statusCode && err.statusCode === 401) {
        this.checkStoredAuthToken()
          .then((didRefreshToken) => {
            if (!didRefreshToken) {
              this.router.history.replace('/login');
            }
          });
      }
    });

    ipcRenderer.on('didLogin', (event, tokenInfo) => {
      database.insert({
        key: 'oauth_token',
        value: tokenInfo,
      });
      pcoWrapper.apiClient.http.accessToken = tokenInfo.token.access_token;
      this.router.history.replace('/logged_in/plans');
      store.dispatch(currentUserActions.reloadCurrentUser());
    });
  }

  componentDidMount() {
    this.checkStoredAuthToken();
  }

  checkStoredAuthToken = () => (
    new Promise((resolve) => {
      auth.loadStoredToken()
        .then((token) => {
          if (!token) {
            this.router.history.replace('/login');
            resolve(false);
          } else if (auth.shouldRefreshToken(token)) {
            auth.refreshStoredToken(token)
              .then((refreshedToken) => {
                if (refreshedToken) {
                  pcoWrapper.apiClient.http.accessToken = refreshedToken.token.access_token;
                  this.router.history.replace('/logged_in/plans');
                  resolve(true);
                } else {
                  this.router.history.replace('/login');
                  resolve(false);
                }
              });
          } else {
            pcoWrapper.apiClient.http.accessToken = token.token.access_token;
            this.router.history.replace('/logged_in/plans');
            resolve(false);
          }
        });
    })
  );

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

  handleStartUpdate = () => {
    ipcRenderer.send('startUpdate');
  };

  handleInstallUpdate = () => {
    ipcRenderer.send('installUpdate');
  };

  handleCloseModal = () => {
    store.dispatch({
      type: reduxActionKeys.NO_UPDATE_AVAILABLE,
    });
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

  updateDialogTitle = () => {
    if (this.state.update.updateDownloaded) {
      return 'Update Downloaded';
    }

    if (this.state.update.updateProgress > -1) {
      return 'Downloading Update...';
    }

    return 'Update Available';
  };

  updateDialogMessage = () => {
    if (this.state.update.updateDownloaded) {
      return null;
    }

    if (this.state.update.updateProgress > -1) {
      return <LinearProgress mode="determinate" value={this.state.update.updateProgress} />;
    }

    return `Version ${this.state.update.updateInfo.version} is available. You have version ${electronRemote.app.getVersion()}. Would you like to download the update now?`;
  };

  updateDialogActions = () => {
    if (this.state.update.updateDownloaded) {
      return [
        <FlatButton
          primary
          keyboardFocused
          label="Install and restart"
          onTouchTap={this.handleInstallUpdate}
        />,
      ];
    }

    if (this.state.update.updateProgress > -1) {
      return [];
    }

    return [
      <FlatButton
        primary
        label="Remind me later"
        onTouchTap={this.handleCloseModal}
      />,
      <FlatButton
        primary
        keyboardFocused
        label="Download update"
        onTouchTap={this.handleStartUpdate}
      />,
    ];
  };

  render() {
    const fullPlayerUI = settings.getStoredSettings().fullPlayerUI;

    return (
      <Provider store={store}>
        <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
          <Router basename="/" ref={(component) => { this.router = component; }}>
            <div
              id="app"
              className={this.selectedAttachmentTypeClassName()}
            >
              {
                this.state.update.updateAvailable ?
                  <div className="modal">
                    <Dialog
                      title={this.updateDialogTitle()}
                      actions={this.updateDialogActions()}
                      open
                      modal
                    >
                      {this.updateDialogMessage()}
                    </Dialog>
                  </div>
                : null
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
                  <Route path="/logged_in" component={LoggedIn} />
                  <Route path="/logged_in/plans" exact component={Plans} />
                  <Route path="/logged_in/songs" component={SongsList} />
                  <Route path="/logged_in/plans/:planId" component={SinglePlan} />
                  <Route path="/logged_in/app/settings" component={Settings} />
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
