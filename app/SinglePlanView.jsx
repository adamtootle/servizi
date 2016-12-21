import React, { Component, PropTypes } from 'react';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import CircularProgress from 'material-ui/CircularProgress';
import { filter, findIndex } from 'lodash';
import S from 'string';
import ReactPlayer from 'react-player';
import IconButton from 'material-ui/IconButton';
import ActionPlayIcon from 'material-ui/svg-icons/av/play-arrow';
import ActionPauseIcon from 'material-ui/svg-icons/av/pause';
import ActionPreviousIcon from 'material-ui/svg-icons/av/skip-previous';
import ActionNextIcon from 'material-ui/svg-icons/av/skip-next';
import { ipcRenderer } from 'electron';
import scrollIntoView from 'scroll-into-view-if-needed';

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
            const planAttachments = res.planAttachments;
            const newData = filter(planAttachments.data, attachment => attachment.attributes.pco_type === 'AttachmentS3');
            planAttachments.data = newData;
            this.setState({
              plan: res.plan,
              planItems: res.planItems,
              planAttachments,
            });
          });

    ipcRenderer.on('MediaPlayPause', () => {
      this.handleClickPlayPause();
    });

    ipcRenderer.on('MediaPreviousTrack', () => {
      this.handleClickPreviousTrack();
    });

    ipcRenderer.on('MediaNextTrack', () => {
      this.handleClickNextTrack();
    });
  }

  handleGetSchedulesResponse = (ev, schedules) => {
    this.setState({
      schedules,
    });
  };

  handleClickAttachment = (attachment) => {
    scrollIntoView(this[`attachment${attachment.id}ListItem`]);
    const attachmentIndex = findIndex(this.state.planAttachments.data, attachmentToMatch => attachment.id === attachmentToMatch.id);
    console.log("attachmentIndex = " + attachmentIndex);
    this.setState({
      selectedAttachmentUrl: null,
      selectedAttachmentIndex: attachmentIndex,
      selectedAttachment: attachment,
      playAudio: false,
      playerTotalSeconds: 0,
      playerCurrentTime: 0,
    });
    window.apiClient.attachments.getAttachmentStreamUrl(attachment)
      .then((res) => {
        this.setState({
          selectedAttachmentUrl: res.data.attributes.attachment_url,
          playAudio: true,
        });
      });
  };

  handleClickPlayPause = () => {
    this.setState({
      playAudio: !this.state.playAudio,
    });
  }

  handleClickPreviousTrack = () => {

  }

  handleClickNextTrack = () => {
    if (this.state.selectedAttachmentIndex < this.state.planAttachments.data.length - 1) {
      this.handleClickAttachment(this.state.planAttachments.data[this.state.selectedAttachmentIndex + 1]);
    } else {
      this.handleClickAttachment(this.state.planAttachments.data[0]);
    }
  }

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

    let playerProgressBarPercentageWidth = (this.state.playerCurrentTime / this.state.playerTotalSeconds) * 100;

    if (isNaN(playerProgressBarPercentageWidth)) {
      playerProgressBarPercentageWidth = 0;
    }

    return (
      <div>
        {(() => {
          if (this.state.selectedAttachment !== null) {
            return (
              <div
                id="player-container"
              >
                <div
                  ref={(ref) => {
                    this.playerContainer = ref;
                  }}
                  id="player-container-inner"
                  onClick={(ev) => {
                    this.audioPlayer.seekTo(ev.clientX / this.playerContainer.clientWidth);
                  }}
                >
                  <div
                    id="player-progress-bar"
                    style={{
                      width: `${playerProgressBarPercentageWidth}%`,
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

                        let currentTimeMinutes = Math.floor(this.state.playerCurrentTime / 60);
                        if (isNaN(currentTimeMinutes)) {
                          currentTimeMinutes = 0;
                        }
                        let currentTimeSeconds = Math.ceil(this.state.playerCurrentTime % 60);
                        if (isNaN(currentTimeSeconds)) {
                          currentTimeSeconds = 0;
                        }

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
                      <IconButton
                        ref={(ref) => {
                          this.previousButton = ref;
                        }}
                        onClick={(ev) => {
                          ev.preventDefault();
                          ev.stopPropagation();
                          this.handleClickPreviousTrack();
                        }}
                      >
                        <ActionPreviousIcon />
                      </IconButton>
                      <IconButton
                        ref={(ref) => {
                          this.playButton = ref;
                        }}
                        onClick={(ev) => {
                          ev.preventDefault();
                          ev.stopPropagation();
                          this.handleClickPlayPause();
                        }}
                      >
                        {(() => {
                          if (this.state.playAudio) {
                            return <ActionPauseIcon />;
                          }

                          return <ActionPlayIcon />;
                        })()}
                      </IconButton>
                      <IconButton
                        ref={(ref) => {
                          this.nextButton = ref;
                        }}
                        onClick={(ev) => {
                          ev.preventDefault();
                          ev.stopPropagation();
                          this.handleClickNextTrack();
                        }}
                      >
                        <ActionNextIcon />
                      </IconButton>
                    </div>
                  </div>
                </div>
                <ReactPlayer
                  ref={(ref) => {
                    this.audioPlayer = ref;
                  }}
                  url={this.state.selectedAttachmentUrl}
                  progressFrequency="500"
                  playing={this.state.playAudio}
                  width="100%"
                  height="0px"
                  onReady={() => {
                    // console.log('onReady');
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
        <SelectableList id="plan-items-container">
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
                    {itemAttachments.map((attachment) => {
                      const itemIsSelected = this.state.selectedAttachment !== null && this.state.selectedAttachment.id === attachment.id;
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
                            this.handleClickAttachment(attachment);
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
