import React, { Component, PropTypes } from 'react';
import IconButton from 'material-ui/IconButton';
import ChevronIcon from 'material-ui/svg-icons/navigation/chevron-left';
import SettingsIcon from 'material-ui/svg-icons/action/settings';

class Navbar extends Component {
  static propTypes = {
    location: PropTypes.object,
  };

  static contextTypes = {
    player: PropTypes.object,
  };

  constructor(args) {
    super(args);

    this.state = {};
  }

  render() {
    const pathDepth = this.context.player.location.pathname.split('/').length;
    return (
      <div id="navbar">
        {(() => {
          if (pathDepth > 1) {
            return (
              <IconButton
                id="navbar-back-button"
                onClick={this.handleClickBackButton}
              >
                <ChevronIcon />
              </IconButton>
            );
          }

          return <span />;
        })()}
        {this.state.title}
        {(() => {
          if (pathDepth === 1) {
            return (
              <IconButton
                id="navbar-settings-button"
                onClick={this.handleClickSettingsButton}
              >
                <SettingsIcon />
              </IconButton>
            );
          }

          return <span />;
        })()}
      </div>
    );
  }
}

export default Navbar;
