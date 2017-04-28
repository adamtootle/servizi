import React, { Component, PropTypes } from 'react';
import { NavLink } from 'react-router-dom'

export default class SideMenu extends Component {
  static contextTypes = {
    router: PropTypes.object,
    uiRoutePrefix: PropTypes.string,
  };

  render() {
    return (
      <div id="side-menu">
        <div id="plan-items-container">
          <NavLink to="/account" id="account-link">My Account</NavLink>
          <NavLink to="/plans">Plans</NavLink>
          <NavLink to="/songs">Songs</NavLink>
          <NavLink to="/app/settings">Settings</NavLink>
        </div>
      </div>
    );
  }
}
