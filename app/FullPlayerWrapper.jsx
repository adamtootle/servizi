import React, { Component, PropTypes } from 'react';
import SideMenu from './FullPlayer/SideMenu';

class FullPlayerWrapper extends Component {
  static propTypes = {
    children: PropTypes.array,
    location: PropTypes.object,
  };

  static childContextTypes = {
    uiRoutePrefix: PropTypes.string,
  };

  getChildContext() {
    return {
      uiRoutePrefix: 'full',
    };
  }

  render() {
    return (
      <div id="app" className="full-player">
        <SideMenu />
        {React.cloneElement(this.props.children, {
          key: this.props.location.pathname,
        })}
      </div>
    );
  }
}

export default FullPlayerWrapper;
