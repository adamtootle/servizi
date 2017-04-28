import React, { Component, PropTypes } from 'react';
import { ListItem } from 'material-ui/List';
import SelectableList from './SelectableList';

class SideMenu extends Component {
  static contextTypes = {
    router: PropTypes.object,
    uiRoutePrefix: PropTypes.string,
  };

  render() {
    return (
      <div id="side-menu">
        <SelectableList id="plan-items-container" defaultValue={0}>
          <ListItem
            value={0}
            onClick={() => {
              this.context.router.replace('/schedules');
            }}
          >
            Schedules
          </ListItem>
          <ListItem
            value={1}
            onClick={() => {
              this.context.router.replace('/songs');
            }}
          >
            Songs
          </ListItem>
          <ListItem
            value={2}
            onClick={() => {
              this.context.router.replace('/app/settings');
            }}
          >
            Settings
          </ListItem>
        </SelectableList>
      </div>
    );
  }
}

export default SideMenu;
