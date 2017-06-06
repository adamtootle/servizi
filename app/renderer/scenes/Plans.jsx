import React, { Component, PropTypes } from 'react';
import { List, ListItem } from 'material-ui/List';
import { connect } from 'react-redux';
import { schedules as schedulesActions, currentUser as currentUserActions } from '../../redux/actions';

class Plans extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
  };
  static defaultProps = {};
  static contextTypes = {
    router: PropTypes.object,
    player: PropTypes.object,
    uiRoutePrefix: PropTypes.string,
  };

  componentDidMount() {
    this.props.dispatch(currentUserActions.reloadCurrentUser());
    this.props.dispatch(schedulesActions.loadSchedules());
  }

  handleClickPlan = (schedule) => {
    const plan = schedule.relationships.plan;
    const route = `/logged_in/plans/${plan.data.id}`;
    setTimeout(() => {
      this.context.router.history.push(route);
    }, 300);
  };

  render() {
    return (
      <div>
        <List>
          {this.props.schedules.schedules.map((schedule) => {
            const serviceTypeName = schedule.attributes.service_type_name;
            const teamPositionName = schedule.attributes.team_position_name;
            const teamName = schedule.attributes.team_name;
            return (
              <ListItem
                key={schedule.id}
                primaryText={schedule.attributes.dates}
                secondaryText={`${serviceTypeName} - ${teamPositionName} (${teamName})`}
                onClick={() => {
                  this.handleClickPlan(schedule);
                }}
              />
            );
          })}
        </List>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { schedules: state.schedules };
}

export default connect(mapStateToProps)(Plans);
