import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { ipcRenderer } from 'electron';
import RaisedButton from 'material-ui/RaisedButton';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';

class PlansListView extends Component {
  static propTypes = {};
  static defaultProps = {};
  static contextTypes = {
    router: PropTypes.object,
    playr: PropTypes.object,
  };

  constructor(args) {
    super(args);

    this.state = {
      schedules: [],
    };
  }

  componentDidMount() {
    ipcRenderer.on('getSchedules', this.handleGetSchedulesResponse);
    ipcRenderer.send('getSchedules');
  }

  handleGetSchedulesResponse = (ev, schedules) => {
    this.setState({
      schedules,
    });
    this.context.playr.schedules = schedules;
  };

  handlePlanClick = (plan) => {
    this.context.router.push(`/plans/${plan.id}`);
  };

  render() {
    return (
      <div>
        <List>
          {this.state.schedules.map((schedule) => {
            // console.log(schedule);
            return (
              <div>
                {schedule.plans.map((plan) => {
                  return (
                    <ListItem
                      primaryText={plan.attributes.short_dates}
                      secondaryText={schedule.schedule.attributes.service_type_name}
                      onClick={() => {
                        this.handlePlanClick(plan);
                      }}
                    />
                  );
                })}
              </div>
            );
          })}
        </List>
      </div>
    );
  }
}

export default PlansListView;
