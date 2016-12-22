import React, { Component, PropTypes } from 'react';
import IconButton from 'material-ui/IconButton';
import ChevronIcon from 'material-ui/svg-icons/navigation/chevron-left';
import SettingsIcon from 'material-ui/svg-icons/action/settings';

class MiniPlayerWrapper extends Component {

  static propTypes = {
    children: PropTypes.array,
    location: PropTypes.object,
  };

  static childContextTypes = {
    uiRoutePrefix: PropTypes.string,
  };

  getChildContext() {
    return {
      uiRoutePrefix: 'mini',
    };
  }

  render() {
    return (
      <div id="app" className="mini-player">
        <div id="navbar">
          {(() => {
            if (this.state.pathDepth > 1) {
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
            if (this.state.pathDepth === 1) {
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
        {React.cloneElement(this.props.children, {
          key: this.props.location.pathname,
        })}
      </div>
    );
  }
}

export default MiniPlayerWrapper;
