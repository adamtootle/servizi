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
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
    onSelectAttachment: PropTypes.func,
  };

  static contextTypes = {
    player: PropTypes.object,
  };

  static defaultProps = {
    songItems: [],
    planAttachments: [],
  };

  adjustedAttachmentName(name) {
    let adjustedName = name;
    //Great, Great God-A.mp3
    return S(adjustedName).truncate(50).toString().replace(/(.mp3|.wav)*/gi, '');
  }

  render() {
    return (
      <SelectableList id="plan-items-container">
        {this.props.songItems.map((item) => {
          const songId = item.relationships.song.data.id;
          const itemAttachments = filter(this.props.planAttachments.data, (attachment) => {
            return attachment.relationships.attachable.data.id === songId;
          });

          return (
            <div key={item.id}>
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
                    key={attachment.id}
                    ref={(ref) => {
                      this[`attachment${attachment.id}ListItem`] = ref;
                    }}
                    onClick={() => {
                      this.props.onSelectAttachment(attachment);
                    }}
                    style={style}
                  >
                    {this.adjustedAttachmentName(attachment.attributes.filename)}
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
