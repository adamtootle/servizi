import React, { Component, PropTypes } from 'react';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import CircularProgress from 'material-ui/CircularProgress';
import { filter } from 'lodash';
import S from 'string';
import ReactPlayer from 'react-player';
import IconButton from 'material-ui/IconButton';
import ActionPlayIcon from 'material-ui/svg-icons/av/play-arrow';
import ActionPauseIcon from 'material-ui/svg-icons/av/pause';
import ActionPreviousIcon from 'material-ui/svg-icons/av/skip-previous';
import ActionNextIcon from 'material-ui/svg-icons/av/skip-next';

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
      playAudio: false,
      selectedAttachment: null,
      playerTotalSeconds: 0,
      playerCurrentTime: 0,
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
    window.apiClient.attachments.getAttachmentStreamUrl(attachment)
      .then((res) => {
        this.setState({
          selectedAttachmentUrl: res.data.attributes.attachment_url,
          selectedItemIndex: itemIndex,
          selectedAttachmentIndex: attachmentIndex,
          selectedAttachment: attachment,
          playAudio: true,
        });
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
      <div>
        {(() => {
          if (this.state.selectedAttachment !== null) {
            return (
              <div
                style={{
                  height: '50px',
                }}
              >
                <div
                  id="player-container"
                >
                  <div
                    id="player-progress-bar"
                    style={{
                      width: `${(this.state.playerCurrentTime / this.state.playerTotalSeconds) * 100}%`,
                    }}
                  />
                  <div
                    id="player-controls"
                  >
                    <span
                      id="player-timestamp"
                    >
                      {(() => {
                        const totalTimeMinutes = Math.floor(this.state.playerTotalSeconds / 60);
                        const totalTimeSeconds = Math.ceil(this.state.playerTotalSeconds % 60);
                        let totalTimeSecondsString = `${totalTimeSeconds}`;
                        if (totalTimeSeconds < 10) {
                          totalTimeSecondsString = `0${totalTimeSecondsString}`;
                        }

                        const currentTimeMinutes = Math.floor(this.state.playerCurrentTime / 60);
                        const currentTimeSeconds = Math.ceil(this.state.playerCurrentTime % 60);
                        let currentTimeSecondsString = `${currentTimeSeconds}`;
                        if (currentTimeSeconds < 10) {
                          currentTimeSecondsString = `0${currentTimeSecondsString}`;
                        }
                        return `${currentTimeMinutes}:${currentTimeSecondsString}/${totalTimeMinutes}:${totalTimeSecondsString}`;
                      })()}
                    </span>
                    <div
                      id="player-buttons"
                    >
                      <IconButton>
                        <ActionPreviousIcon />
                      </IconButton>
                      <IconButton
                        onClick={(ev) => {
                          ev.preventDefault();
                          this.setState({
                            playAudio: !this.state.playAudio,
                          });
                        }}
                      >
                        {(() => {
                          if (this.state.playAudio) {
                            return <ActionPauseIcon />;
                          }

                          return <ActionPlayIcon />;
                        })()}
                      </IconButton>
                      <IconButton>
                        <ActionNextIcon />
                      </IconButton>
                    </div>
                  </div>
                </div>
                <ReactPlayer
                  url={this.state.selectedAttachmentUrl}
                  progressFrequency="500"
                  playing={this.state.playAudio}
                  width="100%"
                  height="0px"
                  onReady={() => {
                    console.log('onReady');
                  }}
                  onProgress={(progress) => {
                    if (this.state.playerTotalSeconds > 0) {
                      this.setState({
                        playerCurrentTime: this.state.playerTotalSeconds * progress.played,
                      });
                    }
                  }}
                  onDuration={(seconds) => {
                    this.setState({
                      playerTotalSeconds: seconds,
                    });
                  }}
                />
              </div>
            );
          }
        })()}
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
                    <Subheader
                      style={{
                        backgroundColor: '#B4B4B4',
                        color: '#ffffff',
                        lineHeight: '27px',
                      }}
                    >
                      {item.attributes.title}
                    </Subheader>
                    {itemAttachments.map((attachment, attachmentIndex) => {
                      const itemIsSelected = itemIndex === this.state.selectedItemIndex && attachmentIndex === this.state.selectedAttachmentIndex;
                      const style = {
                        backgroundColor: itemIsSelected ? 'rgba(0, 0, 0, 0.05)' : '',
                        color: '#2E2E2E',
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
      </div>
    );
  }
}

export default SinglePlanView;
