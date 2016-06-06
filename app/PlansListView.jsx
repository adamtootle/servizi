import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import RaisedButton from 'material-ui/RaisedButton';

class PlansListView extends Component {
  static propTypes = {};
  static defaultProps = {};

  componentDidMount() {
    ipcRenderer.send('getFuturePlans');
  }

  render() {
    console.log('render');
    return (
      <div>
        PlansListView
      </div>
    );
  }
}

export default PlansListView;
