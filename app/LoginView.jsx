import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import RaisedButton from 'material-ui/RaisedButton';

class LoginView extends Component {
  static propTypes = {};
  static defaultProps = {};

  handleWebLogin = () => {
    ipcRenderer.send('doWebLogin');
  };

  render() {
    return (
      <div id="login">
        <span className="label">To use Playr, you'll first need to log in using your Planning Center account.</span>
        <RaisedButton
          className="login-button"
          label="Login"
          style={{
            width: '100%',
            marginTop: '40px',
          }}
          onClick={this.handleWebLogin}
          backgroundColor="#11629E"
          labelColor="#ffffff"
        />
      </div>
    );
  }
}

export default LoginView;
