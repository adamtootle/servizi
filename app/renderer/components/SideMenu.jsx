import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import electron from 'electron';
import sortBy from 'lodash/sortBy';
import pcoWrapper from '../../main/pco-wrapper';
import { schedules as schedulesActions, currentUser as currentUserActions } from '../../redux/actions';
import reduxActionKeys from '../../redux/actions/keys';
import config from '../../../config';
import analytics from '../../main/analytics';

const { accounts } = electron.remote.getGlobal('servizi').database;

class SideMenu extends Component {
  static contextTypes = {
    router: PropTypes.object,
    uiRoutePrefix: PropTypes.string,
  };

  static propTypes = {
    accounts: PropTypes.array,
    dispatch: PropTypes.func,
  };

  handleSelectAccount(account) {
    const organizationId = account.organizationId;
    const userId = account.userId;
    accounts.update({ selected: true }, { $set: { selected: false } }, {}, () => {
      accounts.update({ organizationId, userId }, { $set: { selected: true } }, {}, () => {
        accounts.find({}, (err, accountsResults) => {
          pcoWrapper.apiClient.http.accessToken = account.tokenInfo.token.access_token;
          this.props.dispatch(currentUserActions.reloadCurrentUser());
          this.context.router.history.replace('/logged_in/schedules');
          this.props.dispatch({
            type: reduxActionKeys.ACCOUNTS_LOADED,
            payload: accountsResults,
          });
          this.props.dispatch({
            type: reduxActionKeys.LOAD_SCHEDULES,
            payload: {
              schedules: [],
            },
          });
          this.props.dispatch({
            type: reduxActionKeys.SHOW_LOADER,
          });
          this.props.dispatch(schedulesActions.loadSchedules());
        });

        analytics.recordEvent(config.aws.eventNames.switchAccount);
      });
    });
  }

  render() {
    return (
      <div id="side-menu">
        {
          this.props.accounts && this.props.accounts.length > 0 ?
            <div id="account-link">
              <NavLink to="/logged_in/accounts">
                <span className="user-name">{this.props.accounts[0].userName}</span>
                <br />
                <span className="organization-name">{this.props.accounts[0].organizationName}</span>
              </NavLink>
              <div id="accounts-list">
                {this.props.accounts.map(account => (
                  <div
                    className="account-item"
                    key={`${account.organizationId}_${account.userId}`}
                  >
                    <a
                      onClick={this.handleSelectAccount.bind(this, account)}
                    >
                      <span className="user-name">{account.userName}</span>
                      <br />
                      <span className="organization-name">{account.organizationName}</span>
                    </a>
                  </div>
                ))}
                <div className="account-item">
                  <Link to="/add-account" className="add-account">+ Add Account</Link>
                </div>
              </div>
            </div>
            : null
        }
        <div id="plan-items-container">
          <NavLink
            to="/logged_in/schedules"
            isActive={(match, location) => {
              return match || location.pathname.indexOf('/plans/') !== -1;
            }}
          >
            Schedule
          </NavLink>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const sortedAccounts = sortBy(state.accounts, (account) => {
    return !account.selected;
  });
  return { accounts: sortedAccounts };
}

export default connect(mapStateToProps)(SideMenu);
