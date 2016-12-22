import React, { Component, PropTypes } from 'react';
import Subheader from 'material-ui/Subheader';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import { filter } from 'lodash';
import S from 'string';

const SelectableList = makeSelectable(List);

class AttachmentsList extends Component {
  static propTypes = {
    songItems: PropTypes.arrayOf(PropTypes.object),
    planAttachments: PropTypes.shape({
      data: PropTypes.array,
    }),
    selectedAttachment: PropTypes.shape({
      id: PropTypes.number,
    }),
    onSelectAttachment: PropTypes.function,
  };

  static defaultProps = {
    songItems: [],
    planAttachments: [],
  };

  render() {
    return (
      <SelectableList id="plan-items-container">
        {this.props.songItems.map((item) => {
          const songId = item.relationships.song.data.id;
          const itemAttachments = filter(this.props.planAttachments.data, (attachment) => {
            return attachment.relationships.attachable.data.id === songId;
          });

          return (
            <div>
              <Subheader
                style={{
                  backgroundColor: '#B4B4B4',
                  color: '#ffffff',
                  lineHeight: '27px',
                }}
              >
                {item.attributes.title}
              </Subheader>
              {itemAttachments.map((attachment) => {
                const itemIsSelected = this.props.selectedAttachment !== null && this.props.selectedAttachment.id === attachment.id;
                const style = {
                  backgroundColor: itemIsSelected ? 'rgba(0, 0, 0, 0.05)' : '',
                  color: '#2E2E2E',
                };
                return (
                  <ListItem
                    ref={(ref) => {
                      this[`attachment${attachment.id}ListItem`] = ref;
                    }}
                    onClick={() => {
                      this.props.onSelectAttachment(attachment);
                    }}
                    style={style}
                  >
                    {S(attachment.attributes.filename).truncate(50).toString()}
                  </ListItem>
                );
              })}
            </div>
          );
        })}
      </SelectableList>
    );
  }
}

export default AttachmentsList;
