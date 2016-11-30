import React, { Component, PropTypes } from 'react';
import { List, ListItem } from 'material-ui/List';

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
    window.pco.plans.getFuturePlans()
      .then((schedules) => {
        console.log(schedules[0].plans);
        console.log(schedules[0].schedule);
        this.setState({
          schedules: schedules[0].schedules,
        });
        // this.context.playr.plans = plans;
      });
  }

  handlePlanClick = (plan) => {
    this.context.router.push(`/plans/${plan.id}`);
  };

  render() {
    return (
      <div>
        <List>
          {this.state.schedules.map((schedule) => {
            console.log(schedule);
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
        </List>
      </div>
    );
  }
}

export default PlansListView;
