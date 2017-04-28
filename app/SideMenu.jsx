import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom'
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
            innerDivStyle={{
              padding: 0,
            }}
          >
            <Link to="/schedules">Schedules</Link>
          </ListItem>
          <ListItem
            value={1}
            innerDivStyle={{
              padding: 0,
            }}
          >
            <Link to="/songs">Songs</Link>
          </ListItem>
          <ListItem
            value={2}
            innerDivStyle={{
              padding: 0,
            }}
          >
            <Link to="/app/settings">Settings</Link>
          </ListItem>
        </SelectableList>
      </div>
    );
  }
}

export default SideMenu;
