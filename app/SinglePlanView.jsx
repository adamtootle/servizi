import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import RaisedButton from 'material-ui/RaisedButton';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';

class SinglePlanView extends Component {
  static propTypes = {};
  static defaultProps = {};

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
  };

  handlePlanClick = (plan) => {
    console.log(plan);
  };

  render() {
    return (
      <div>
        SinglePlanView
      </div>
    );
  }
}

export default SinglePlanView;
