import React, { Component, PropTypes } from 'react';
import { List, ListItem, makeSelectable } from 'material-ui/List';

const SelectableList = makeSelectable(List);

class SideMenu extends Component {
  static contextTypes = {
    router: PropTypes.object,
    uiRoutePrefix: PropTypes.string,
  };

  render() {
    const style = {
      backgroundColor: '',
      color: '#2E2E2E',
    };
    return (
      <div id="side-menu">
        <SelectableList id="plan-items-container">
          <ListItem
            onClick={() => {
              this.context.router.replace('/schedules');
            }}
            style={style}
          >
            Schedules
          </ListItem>
          <ListItem
            onClick={() => {
              // this.props.onSelectAttachment(attachment);
            }}
            style={style}
          >
            Songs
          </ListItem>
          <ListItem
            onClick={() => {
              this.context.router.replace('/app/settings');
            }}
            style={style}
          >
            Settings
          </ListItem>
        </SelectableList>
      </div>
    );
  }
}

export default SideMenu;
