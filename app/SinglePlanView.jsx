import React, { Component, PropTypes } from 'react';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import { forEach, find } from 'lodash';
import CircularProgress from 'material-ui/CircularProgress';

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
      plan: null,
      planItems: null,
      planAttachments: null,
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
    setTimeout(() => {
      this.setState({
        plan,
      });
    }, 0);

    Promise.all(plan.items.map((item) => window.pco.plans.getPlanItem(item)))
    .then((planItems) => {
      this.setState({
        planItems,
      });
      console.log('items');
      console.log(planItems);
    });
  }

  handleGetSchedulesResponse = (ev, schedules) => {
    this.setState({
      schedules,
    });
  };

  handleItemClick = (plan, index) => {
    console.log(plan);
    console.log(this.state.planItems[index]);
  };

  render() {
    if (this.state.planItems === null || this.state.planAttachments === null) {
      return (
        <div className="loading-indicator-wrapper" style={{ marginTop: '100px' }}>
          <CircularProgress />
        </div>
      );
    }

    return (
      <List>
        <Subheader>Items</Subheader>
        {(() => {
          if (this.state.plan !== null) {
            return this.state.plan.items.map((item, index) => {
              if (this.state.planItems === null) {
                return (
                  <ListItem disabled>
                    {item.attributes.title} (loading...)
                  </ListItem>
                );
              }

              return (
                <ListItem
                  onClick={() => {
                    this.handleItemClick(item, index);
                  }}
                >
                  {item.attributes.title}
                </ListItem>
              );
            });
          }

          return '';
        })()}
      </List>
    );
  }
}

export default SinglePlanView;
