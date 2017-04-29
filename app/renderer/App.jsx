import React, { Component, PropTypes } from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CircularProgress from 'material-ui/CircularProgress';
import { ipcRenderer } from 'electron';
import { HashRouter as Router, Route } from 'react-router-dom';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { electronEnhancer } from 'redux-electron-store';
import Navbar from './components/Navbar';
import SideMenu from './components/SideMenu';
import PlayerContext from './PlayerContext';
import settings from '../main/settings';
import keys from '../main/keys';
import { Login, SinglePlan, Plans, SongsList, Settings } from './scenes';
import reducers from '../reducers';
import PlayerControls from './components/PlayerControls';

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

  // getChildContext() {
  //   this.playerContext.location = this.props.location;
  //   return {
  //     player: this.playerContext,
  //   };
  // }

  componentDidMount() {
    window.validateAuth().then(this.handleValidateAuthResponse);
  }

  componentWillReceiveProps(props) {
    // const newPathDepth = this.context.router.history.location.pathname.split('/').length - 1;
    // let transitionDirection;
    // if (newPathDepth > this.state.pathDepth) {
    //   transitionDirection = 'push';
    // } else {
    //   transitionDirection = 'pop';
    // }
    this.setState({
      // pathDepth: newPathDepth,
      // transitionDirection,
      player: {
        timestamp: '',
      },
    });
  }

  handleValidateAuthResponse = (valid) => {
    // if (valid) {
    //   this.context.router.history.replace('schedules');
    // } else {
    //   this.context.router.history.replace('login');
    // }

    this.setState({
      showLoader: false,
    });
  };

  handleLoginResults = () => {
    console.log('handleLoginResults');
  };

  render() {
    const fullPlayerUI = settings.getStoredSettings().fullPlayerUI;

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
      <Provider store={store}>
        <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
          <Router basename="/">
            <div id="app" className={fullPlayerUI ? 'full-player' : 'mini-player'}>
              {
                fullPlayerUI ?
                  <SideMenu />
                  : <Navbar />
              }
              <div id={fullPlayerUI ? 'full-player-inner' : 'mini-player-inner'}>
                <Route path="/login" component={Login} />
                <Route path="/plans" exact component={Plans} />
                <Route path="/songs" component={SongsList} />
                <Route path="/plans/:planId" component={SinglePlan} />
                <Route path="/app/settings" component={Settings} />
              </div>
              <PlayerControls
                selectedAttachment={this.state.selectedAttachment}
                playAudio={this.state.playAudio}
              />
            </div>
          </Router>
        </MuiThemeProvider>
      </Provider>
    );
  }
}
