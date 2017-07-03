import React, { Component } from 'react';
import PropTypes from 'prop-types';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CircularProgress from 'material-ui/CircularProgress';
import electron, { ipcRenderer, remote as electronRemote } from 'electron';
import { HashRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import ReactPlayer from 'react-player';
import Promise from 'bluebird';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import LinearProgress from 'material-ui/LinearProgress';
import settings from '../main/settings';
import { Login, SinglePlan, Schedules, SongsList, Settings, LoggedIn, Account } from './scenes';
import PlayerControls from './components/PlayerControls';
import { player as playerActions, currentUser as currentUserActions, schedules as schedulesActions } from '../redux/actions';
import pcoWrapper from '../main/pco-wrapper';
import auth from '../main/auth';
import store from '../main/redux-store';
import reduxActionKeys from '../redux/actions/keys';

const { accounts } = electron.remote.getGlobal('servizi').database;
const platform = process.platform === 'darwin' ? 'macos' : 'windows';

const theme = {
  palette: {
    primary1Color: '#2e2e2e',
    textColor: '#11629E',
  },
};

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
        this.refreshAuthToken();
      }
    });

    ipcRenderer.on('didAddAccount', (event, tokenInfo) => {
      pcoWrapper.apiClient.http.accessToken = tokenInfo.token.access_token;
      Promise.all([
        pcoWrapper.apiClient.reloadMe(),
        pcoWrapper.apiClient.services.organizations.getOrganization(),
      ]).then((responses) => {
        const userId = responses[0].data.id;
        const userName = `${responses[0].data.attributes.first_name} ${responses[0].data.attributes.last_name}`;
        const organizationId = responses[1].data.id;
        const organizationName = responses[1].data.attributes.name;
        const newAccount = {
          organizationId,
          organizationName,
          userId,
          userName,
          tokenInfo,
          selected: true,
        };

        accounts.update({ selected: true }, { $set: { selected: false } }, {}, () => {
          accounts.update({ organizationId, userId }, newAccount, { upsert: true }, () => {
            this.router.history.replace('/logged_in/schedules');
            this.handleReloadAccounts();
          });
        });
      });
    });
  }

  componentDidMount() {
    this.getStoredAccounts()
      .then((storedAccounts) => {
        if (storedAccounts.length === 0) {
          this.router.history.replace('/add-account');
        } else {
          const selectedAccount = storedAccounts.filter(account => account.selected === true)[0];
          pcoWrapper.apiClient.http.accessToken = selectedAccount.tokenInfo.token.access_token;
          this.handleReloadAccounts();
        }
      });

    this.refreshAuthToken();
  }

  getStoredAccounts = () => {
    return new Promise((resolve) => {
      accounts.find({}, (err, result) => {
        resolve(result);
      });
    });
  };

  checkStoredAuthToken = () => (
    new Promise((resolve) => {
      auth.loadStoredToken()
        .then((token) => {
          if (!token) {
            this.router.history.replace('/add-account');
            resolve(false);
          } else if (auth.shouldRefreshToken(token)) {
            auth.refreshStoredToken(token)
              .then((refreshedToken) => {
                if (refreshedToken) {
                  pcoWrapper.apiClient.http.accessToken = refreshedToken.token.access_token;
                  this.router.history.replace('/logged_in/schedules');
                  resolve(true);
                } else {
                  this.router.history.replace('/add-account');
                  resolve(false);
                }
              });
          } else {
            pcoWrapper.apiClient.http.accessToken = token.token.access_token;
            this.router.history.replace('/logged_in/schedules');
            resolve(false);
          }
        });
    })
  );

  refreshAuthToken() {
    auth.refreshSelectedAccountTokenIfNecessary()
      .then((tokenInfo) => {
        pcoWrapper.apiClient.http.accessToken = tokenInfo.token.access_token;
        this.router.history.replace('/logged_in/schedules');
        this.handleReloadAccounts();
      });
  }

  handleReloadAccounts() {
    store.dispatch(currentUserActions.reloadCurrentUser());
    accounts.find({}, (err, storedAccounts) => {
      store.dispatch({
        type: reduxActionKeys.ACCOUNTS_LOADED,
        payload: storedAccounts,
      });
      store.dispatch({
        type: reduxActionKeys.LOAD_SCHEDULES,
        payload: {
          schedules: [],
        },
      });
      store.dispatch(schedulesActions.loadSchedules());
    });
  }

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
    } else {
      store.dispatch(playerActions.nextAttachment());
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

    className = `${className} ${platform}`;

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
                  <Route path="/add-account" component={Login} />
                  <Route path="/accounts/:accountId" component={Account} />
                  <Route path="/logged_in" component={LoggedIn} />
                  <Route path="/logged_in/schedules" exact component={Schedules} />
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
