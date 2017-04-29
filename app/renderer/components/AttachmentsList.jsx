import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Subheader from 'material-ui/Subheader';
import { ListItem } from 'material-ui/List';
import { filter } from 'lodash';
import S from 'string';
import SelectableList from './SelectableList';
import actions from '../../actions';

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

  componentDidMount() {
    console.log(this.props);
  }

  adjustedAttachmentName(name) {
    return S(name).truncate(50).toString().replace(/(.mp3|.wav)*/gi, '');
  }

  render() {
    let attachmentIndex = -1;
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
                  backgroundColor: 'rgba(27, 127, 220, 0.1)',
                  color: '#2E2E2E',
                  lineHeight: '27px',
                }}
              >
                {item.attributes.title}
              </Subheader>
              {itemAttachments.map((attachment) => {
                attachmentIndex++;
                const itemIsSelected = this.props.selectedAttachment !== null && this.props.selectedAttachment.id === attachment.id;
                const style = {
                  backgroundColor: itemIsSelected ? 'rgba(0, 0, 0, 0.05)' : '',
                  color: '#2E2E2E',
                };
                return (
                  <ListItem
                    key={attachment.id}
                    value={attachmentIndex}
                    ref={(ref) => {
                      this[`attachment${attachment.id}ListItem`] = ref;
                    }}
                    onClick={() => {
                      // this.props.onSelectAttachment(attachment);
                      this.props.dispatch(actions.player.playAttachment(attachment));
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
  return { todos: state.todos };
}

export default connect(mapStateToProps)(AttachmentsList);