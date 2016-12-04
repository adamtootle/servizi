import React, { Component, PropTypes } from 'react';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import CircularProgress from 'material-ui/CircularProgress';
import { filter } from 'lodash';
import S from 'string';

const SelectableList = makeSelectable(List);

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
      planItems: null,
      planAttachments: null,
      selectedItemIndex: -1,
      selectedAttachmentIndex: -1,
    };
  }

  componentDidMount() {
    window.apiClient.plans.getPlan({ serviceTypeId: this.props.params.service_type_id, planId: this.props.params.plan_id })
          .then(window.apiClient.plans.getPlanItems)
          .then(window.apiClient.plans.getPlanAttachments)
          .then((res) => {
            this.setState({
              plan: res.plan,
              planItems: res.planItems,
              planAttachments: res.planAttachments,
            });
          });
  }

  handleGetSchedulesResponse = (ev, schedules) => {
    this.setState({
      schedules,
    });
  };

  handleItemClick = (attachment, itemIndex, attachmentIndex) => {
    console.log(attachment.attributes.url);
    this.setState({
      selectedItemIndex: itemIndex,
      selectedAttachmentIndex: attachmentIndex,
    });
  };

  render() {
    if (this.state.planItems === null || this.state.planAttachments === null || this.state.planAttachments === null) {
      return (
        <div className="loading-indicator-wrapper" style={{ marginTop: '100px' }}>
          <CircularProgress />
        </div>
      );
    }

    const songItems = filter(this.state.planItems.data, (item) => {
      return item.attributes.item_type === 'song';
    });

    return (
      <SelectableList>
        {(() => {
          if (this.state.plan !== null) {
            return songItems.map((item, itemIndex) => {
              const songId = item.relationships.song.data.id;
              const itemAttachments = filter(this.state.planAttachments.data, (attachment) => {
                return attachment.relationships.attachable.data.id === songId;
              });

              return (
                <div>
                  <Subheader>{item.attributes.title}</Subheader>
                  {itemAttachments.map((attachment, attachmentIndex) => {
                    const itemIsSelected = itemIndex === this.state.selectedItemIndex && attachmentIndex === this.state.selectedAttachmentIndex;
                    const style = {
                      backgroundColor: itemIsSelected ? 'rgba(0, 0, 0, 0.05)' : '',
                    };
                    return (
                      <ListItem
                        onClick={() => {
                          this.handleItemClick(attachment, itemIndex, attachmentIndex);
                        }}
                        style={style}
                      >
                        {S(attachment.attributes.filename).truncate(50).toString()}
                      </ListItem>
                    );
                  })}
                </div>
              );
            });
          }

          return '';
        })()}
      </SelectableList>
    );
  }
}

export default SinglePlanView;
