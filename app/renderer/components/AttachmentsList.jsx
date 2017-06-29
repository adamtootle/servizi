import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Subheader from 'material-ui/Subheader';
import { ListItem } from 'material-ui/List';
import { filter } from 'lodash';
import S from 'string';
import SelectableList from './SelectableList';
import { player as playerActions } from '../../redux/actions';

class AttachmentsList extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    plans: PropTypes.shape({
      itemsAndAttachments: PropTypes.array,
    }),
    player: PropTypes.shape({
      selectedAttachment: PropTypes.object,
    }),
  };

  static contextTypes = {
    player: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      showSkippedAttachmentsForItemIds: [],
    };
  }

  render() {
    let attachmentIndex = -1;
    return (
      <SelectableList id="plan-items-container">
        {this.props.plans.itemsAndAttachments.map((itemAndAttachment) => {
          const item = itemAndAttachment.item;
          const itemAttachments = itemAndAttachment.attachments;
          const skippedAttachments = filter(itemAttachments, attachment => attachment.skipped);
          const showSkippedAttachmentsForItem = this.state.showSkippedAttachmentsForItemIds.indexOf(item.id) !== -1;

          return (
            <div key={item.id}>
              <Subheader
                style={{
                  color: '#5DBCE5',
                  lineHeight: '27px',
                  fontWeight: 'bold',
                  paddingTop: 20,
                }}
              >
                {item.attributes.title}
              </Subheader>
              {itemAttachments.map((attachment) => {
                attachmentIndex += attachmentIndex;

                if (attachment.skipped && !showSkippedAttachmentsForItem) {
                  return null;
                }

                const itemIsSelected = this.props.player.selectedAttachment
                  && this.props.player.selectedAttachment.id === attachment.id;
                const style = {
                  backgroundColor: itemIsSelected ? '#E8EAEB' : '',
                  color: attachment.skipped ? '#BCBEBE' : '#171717',
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
                    innerDivStyle={{
                      padding: '10px 16px',
                    }}
                  >
                    {S(attachment.attributes.filename).truncate(50).toString().replace(/(.mp3|.wav)*/gi, '')}
                  </ListItem>
                );
              })}
              {
                skippedAttachments.length > 0 && !showSkippedAttachmentsForItem ?
                  <ListItem
                    key="skipped_attachments"
                    value={attachmentIndex}
                    style={{
                      color: '#BCBEBE',
                    }}
                    innerDivStyle={{
                      padding: '10px 16px',
                    }}
                    onClick={() => {
                      this.setState({
                        showSkippedAttachmentsForItemIds: this.state.showSkippedAttachmentsForItemIds.concat([item.id]),
                      });
                    }}
                  >
                    {`+ ${skippedAttachments.length} skipped attachments`}
                  </ListItem>
                  : null
              }
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
    plans: state.plans,
  };
}

export default connect(mapStateToProps)(AttachmentsList);
