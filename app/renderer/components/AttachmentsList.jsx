import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Subheader from 'material-ui/Subheader';
import { ListItem } from 'material-ui/List';
import { filter } from 'lodash';
import S from 'string';
import SelectableList from './SelectableList';
import { player as playerActions } from '../../actions';

class AttachmentsList extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
  };

  static contextTypes = {
    player: PropTypes.object,
  };

  adjustedAttachmentName(name) {
    return S(name).truncate(50).toString().replace(/(.mp3|.wav)*/gi, '');
  }

  render() {
    let attachmentIndex = -1;
    return (
      <SelectableList id="plan-items-container">
        {this.props.schedules.currentPlanItems.map((item) => {
          const songId = item.relationships.song.data.id;
          const itemAttachments = filter(this.props.schedules.currentPlanAttachments, (attachment) => {
            return attachment.relationships.attachable.data.id === songId;
          });

          return (
            <div key={item.id}>
              <Subheader
                style={{
                  color: '#969FA5',
                  lineHeight: '27px',
                  fontWeight: 'bold',
                  paddingTop: 20,
                }}
              >
                {item.attributes.title}
              </Subheader>
              {itemAttachments.map((attachment) => {
                attachmentIndex += attachmentIndex;
                const itemIsSelected = this.props.player.selectedAttachment
                  && this.props.player.selectedAttachment.id === attachment.id;
                const style = {
                  backgroundColor: itemIsSelected ? '#E8EAEB' : '',
                  color: '#171717',
                };
                return (
                  <ListItem
                    key={attachment.id}
                    value={attachmentIndex}
                    ref={(ref) => {
                      this[`attachment${attachment.id}ListItem`] = ref;
                    }}
                    onClick={() => {
                      this.props.dispatch(playerActions.playAttachment(attachment));
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

function mapStateToProps(state) {
  return {
    player: state.player,
    schedules: state.schedules,
  };
}

export default connect(mapStateToProps)(AttachmentsList);
