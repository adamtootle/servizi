import React, { Component } from 'react';
import Navbar from '../components/Navbar';
import SideMenu from '../components/SideMenu';
import settings from '../../main/settings';

export default class LoggedIn extends Component {

  render() {
    const fullPlayerUI = settings.getStoredSettings().fullPlayerUI;

    return (
      <div>
        {
          fullPlayerUI ?
            <SideMenu />
            : <Navbar />
        }
        {this.props.children}
      </div>
    );
  }
}
