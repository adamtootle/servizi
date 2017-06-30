import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import RaisedButton from 'material-ui/RaisedButton';

export default class Login extends Component {
  static propTypes = {};
  static defaultProps = {};

  handleWebLogin = () => {
    ipcRenderer.send('doWebLogin');
  };

  render() {
    return (
      <div id="login">
        <span className="label">To use Servizi, you'll first need to log in<br />using your Planning Center account.</span>
        <RaisedButton
          className="login-button"
          label="Login"
          style={{
            width: '200px',
            marginTop: '40px',
          }}
          onClick={this.handleWebLogin}
          backgroundColor="#5DBCE5"
          labelColor="#ffffff"
        />
      </div>
    );
  }
}
