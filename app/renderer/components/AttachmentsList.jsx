import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Subheader from 'material-ui/Subheader';
import { ListItem } from 'material-ui/List';
import { filter } from 'lodash';
import S from 'string';
import SelectableList from './SelectableList';
import { player as playerActions } from '../../redux/actions';
import shouldSkipAttachment from '../../helpers/shouldSkipAttachment';

class AttachmentsList extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    plans: PropTypes.shape({
      currentPlanItems: PropTypes.array,
      currentPlanAttachments: PropTypes.array,
      currentPlanSkippedAttachments: PropTypes.array,
    }),
    player: PropTypes.shape({
      selectedAttachment: PropTypes.object,
    }),
  };

  static contextTypes = {
    player: PropTypes.object,
  };

  render() {
    let attachmentIndex = -1;
    return (
      <SelectableList id="plan-items-container">
        {this.props.plans.currentPlanItems.map((item) => {
          const songId = item.relationships.song.data.id;
          const itemAttachments = filter(this.props.plans.currentPlanAttachments, attachment => attachment.relationships.attachable.data.id === songId);

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
                const itemIsSelected = this.props.player.selectedAttachment
                  && this.props.player.selectedAttachment.id === attachment.id;
                const skipped = shouldSkipAttachment(attachment, this.props.plans.currentPlanSkippedAttachments);
                const style = {
                  backgroundColor: itemIsSelected ? '#E8EAEB' : '',
                  color: skipped ? '#BCBEBE' : '#171717',
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
                    {S(attachment.attributes.filename).truncate(50).toString().replace(/(.mp3|.wav)*/gi, '')}
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
    plans: state.plans,
  };
}

export default connect(mapStateToProps)(AttachmentsList);
