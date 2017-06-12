import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

export default class SideMenu extends Component {
  static contextTypes = {
    router: PropTypes.object,
    uiRoutePrefix: PropTypes.string,
  };

  render() {
    return (
      <div id="side-menu">
        <div id="plan-items-container">
          <NavLink to="/logged_in/plans">Plans</NavLink>
        </div>
      </div>
    );
  }
}
