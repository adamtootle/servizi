import React, { Component, PropTypes } from 'react';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import CircularProgress from 'material-ui/CircularProgress';

class SinglePlanView extends Component {
  static propTypes = {
    params: PropTypes.shape({
      service_type_id: PropTypes.string,
      plan_id: PropTypes.string,
    }),
  };
  static defaultProps = {};
  static contextTypes = {
    router: PropTypes.object,
    playr: PropTypes.object,
  };

  constructor(args) {
    super(args);

    this.state = {
      plan: null,
      planAttachments: null,
    };
  }

  componentDidMount() {
    console.log(this.props.params);
    const planRoute = `/service_types/${this.props.params.service_type_id}/plans/${this.props.params.plan_id}`;
    const planAttachmentsRoute = `/service_types/${this.props.params.service_type_id}/plans/${this.props.params.plan_id}/all_attachments`;
    // console.log(this.context.playr.schedules);
    // let plan;
    // forEach(this.context.playr.schedules, (object) => {
    //   const matchingPlan = find(object.plans, { id: this.props.params.plan_id });
    //   if (matchingPlan !== null) {
    //     plan = matchingPlan;
    //   }
    // });
    // setTimeout(() => {
    //   this.setState({
    //     plan,
    //   });
    // }, 0);
    //
    // Promise.all(plan.items.map((item) => window.pco.plans.getPlanItem(item)))
    // .then((planItems) => {
    //   this.setState({
    //     planItems,
    //   });
    //   console.log('items');
    //   console.log(planItems);
    // });
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
