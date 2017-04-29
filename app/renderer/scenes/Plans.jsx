import React, { Component, PropTypes } from 'react';
import { List, ListItem } from 'material-ui/List';
import { connect } from 'react-redux';
import { schedules as schedulesActions } from '../../actions';

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

  constructor(args) {
    super(args);

    this.state = {
      schedules: [],
    };
  }

  componentDidMount() {
    this.props.dispatch(schedulesActions.loadSchedules());
  }

  handlePlanClick = (schedule) => {
    const serviceType = schedule.relationships.service_type;
    const plan = schedule.relationships.plan;
    const route = `/plans/${plan.data.id}`;
    this.context.router.history.push(route);
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
                  this.handlePlanClick(schedule);
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
