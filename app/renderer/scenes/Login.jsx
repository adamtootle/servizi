import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import RaisedButton from 'material-ui/RaisedButton';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class Login extends Component {
  static propTypes = {
    accounts: React.PropTypes.array,
  };
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
        {
          this.props.accounts.length > 0 ?
            <span
              className="add-account-cancel-link"
              onClick={() => this.props.history.goBack()}
            >
              Cancel
            </span>
          : null
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    accounts: state.accounts,
  };
}

export default connect(mapStateToProps)(Login);
