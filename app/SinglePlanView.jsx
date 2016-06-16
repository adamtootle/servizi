import React, { Component, PropTypes } from 'react';
import { ipcRenderer } from 'electron';
import RaisedButton from 'material-ui/RaisedButton';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import find from 'lodash/find';
import forEach from 'lodash/foreach';

class SinglePlanView extends Component {
  static propTypes = {
    params: PropTypes.object,
  };
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
    // console.log(this.props.params);
    // console.log(this.context.playr.schedules);
    let plan;
    forEach(this.context.playr.schedules, (object) => {
      const matchingPlan = find(object.plans, { id: this.props.params.plan_id });
      if (matchingPlan !== null) {
        plan = matchingPlan;
      }
    });
    console.log('plan');
    console.log(plan);
  }

  handleGetSchedulesResponse = (ev, schedules) => {
    this.setState({
      schedules,
    });
  };

  handlePlanClick = (plan) => {
    console.log(plan);
  };

  render() {
    return (
      <List>
        <Subheader>Items</Subheader>
      </List>
    );
  }
}

export default SinglePlanView;
