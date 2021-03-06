import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, ListItem } from 'material-ui/List';
import { connect } from 'react-redux';
import { schedules as schedulesActions, currentUser as currentUserActions } from '../../redux/actions';
import PlanListItem from '../components/PlanListItem';
import analytics from '../../main/analytics';
import config from '../../../config';

class Schedules extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    schedules: PropTypes.array,
  };
  static defaultProps = {};
  static contextTypes = {
    router: PropTypes.object,
    player: PropTypes.object,
    uiRoutePrefix: PropTypes.string,
  };

  componentDidMount() {
    this.props.dispatch(currentUserActions.reloadCurrentUser());
    // this.props.dispatch(schedulesActions.loadSchedules());
  }

  handleClickPlan = (schedule) => {
    const plan = schedule.relationships.plan;
    const route = `/logged_in/plans/${plan.data.id}`;
    setTimeout(() => {
      this.context.router.history.push(route);
    }, 300);

    analytics.recordEvent(config.aws.eventNames.selectPlan);
  };

  render() {
    return (
      <div>
        {
          this.props.schedules.length === 0 && !this.props.ui.showLoader ?
            <div className="empty-data-message">You have no plans currently scheduled.</div>
            : null
        }
        {
          this.props.schedules.length > 0 ?
            <List>
              {this.props.schedules.map((schedule) => {
                const serviceTypeName = schedule.attributes.service_type_name;
                const teamPositionName = schedule.attributes.team_position_name;
                const teamName = schedule.attributes.team_name;
                return (
                  <PlanListItem
                    key={schedule.id}
                    primaryText={schedule.attributes.dates}
                    secondaryText={`${serviceTypeName} - ${teamPositionName} (${teamName})`}
                    onClick={() => {
                      this.handleClickPlan(schedule);
                    }}
                    style={{
                      color: '#5DBCE5',
                    }}
                    planId={schedule.relationships.plan.data.id}
                  />
                );
              })}
            </List>
          : null
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    schedules: state.schedules.schedules,
    accounts: state.accounts,
    ui: state.ui,
  };
}

export default connect(mapStateToProps)(Schedules);
