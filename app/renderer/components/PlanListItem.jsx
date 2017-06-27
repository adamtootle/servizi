import React from 'react';
import { List, ListItem } from 'material-ui/List';
import { shell } from 'electron';

export default class PlanListItem extends React.Component {
  handleClickViewLink(url, ev) {
    ev.preventDefault();
    shell.openExternal(url);
  };

  render() {
    return (
      <div
        key={this.props.key}
        className="plan-list-item"
      >
        <ListItem
          primaryText={this.props.primaryText}
          secondaryText={this.props.secondaryText}
          onClick={this.props.onClick}
          style={this.props.style}
        />
        <a
          href="#"
          className="pc-link"
          onClick={this.handleClickViewLink.bind(this, `https://planningcenteronline.com/plans/${this.props.planId}`)}
        >
          View on Planning Center
        </a>
      </div>
    );
  }
}