import React from 'react';
import { ListItem } from 'material-ui/List';
import { shell } from 'electron';
import analytics from '../../main/analytics';
import config from '../../../config';

export default class PlanListItem extends React.Component {
  static propTypes = {
    primaryText: React.PropTypes.string,
    secondaryText: React.PropTypes.string,
    onClick: React.PropTypes.func,
    style: React.PropTypes.object,
  };

  handleClickViewLink(url, ev) {
    ev.preventDefault();
    analytics.recordEvent(config.aws.eventNames.viewedPlanOnPlanningCenter);
    shell.openExternal(url);
  }

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