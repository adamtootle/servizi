import React, { Component, PropTypes } from 'react';
import Checkbox from 'material-ui/Checkbox';
import settings from '../../main/settings';

export default class Settings extends Component {
  static propTypes = {};
  static defaultProps = {};
  static contextTypes = {
    router: PropTypes.object,
    player: PropTypes.object,
  };

  constructor(args) {
    super(args);

    this.loadedSettings = {};

    this.state = {
      showFullPlayerMessage: false,
      storedSettings: null,
    };
  }

  componentDidMount() {
    this.loadedSettings = settings.getStoredSettings();
    setTimeout(() => {
      this.setState({
        storedSettings: this.loadedSettings,
      });
    }, 0);
  }

  render() {
    if (this.state.storedSettings === null) {
      return (
        <div />
      );
    }

    return (
      <div id="settings-container">
        {(() => {
          if (this.state.showFullPlayerMessage) {
            return (
              <div>
                App restart required. Click here.
              </div>
            );
          }

          return '';
        })()}
        <Checkbox
          label="Use Full Player"
          labelPosition="left"
          checked={this.state.storedSettings.fullPlayerUI}
          onClick={() => {
            this.setState({
              storedSettings: {
                fullPlayerUI: !this.state.storedSettings.fullPlayerUI,
              },
            });
            setTimeout(() => {
              this.setState({
                showFullPlayerMessage: this.loadedSettings.fullPlayerUI !== this.state.storedSettings.fullPlayerUI,
              });
              settings.setStoredSettings(this.state.storedSettings);
            }, 0);
          }}
        />
      </div>
    );
  }
}
