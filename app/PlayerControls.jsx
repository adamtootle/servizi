import React, { Component, PropTypes } from 'react';
import ReactPlayer from 'react-player';
import IconButton from 'material-ui/IconButton';
import ActionPlayIcon from 'material-ui/svg-icons/av/play-arrow';
import ActionPauseIcon from 'material-ui/svg-icons/av/pause';
import ActionPreviousIcon from 'material-ui/svg-icons/av/skip-previous';
import ActionNextIcon from 'material-ui/svg-icons/av/skip-next';

class PlayerControls extends Component {
  static propTypes = {
    selectedAttachment: PropTypes.shape({
      id: PropTypes.number,
    }),
    onClickPlayPause: PropTypes.function,
    onClickPreviousTrack: PropTypes.function,
    onClickNextTrack: PropTypes.function,
    playAudio: PropTypes.bool,
  };

  static defaultProps = {
    songItems: [],
    planAttachments: [],
    playAudio: false,
  };

  constructor(args) {
    super(args);

    this.state = {
      selectedAttachmentUrl: null,
      playerTotalSeconds: 0,
      playerCurrentTime: 0,
    };
  }

  componentDidMount() {
    this.loadSelectedAttachment();
  }

  componentWillReceiveProps(props, newProps) {
    setTimeout(() => {
      this.loadSelectedAttachment();
    }, 0);
  }

  loadSelectedAttachment() {
    if (this.props.selectedAttachment === null) {
      return;
    }

    window.apiClient.attachments.getAttachmentStreamUrl(this.props.selectedAttachment)
      .then((res) => {
        this.setState({
          selectedAttachmentUrl: res.data.attributes.attachment_url,
        });
      });
  }

  render() {
    let playerProgressBarPercentageWidth = (this.state.playerCurrentTime / this.state.playerTotalSeconds) * 100;

    if (isNaN(playerProgressBarPercentageWidth)) {
      playerProgressBarPercentageWidth = 0;
    }

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
                  this.props.onClickPreviousTrack();
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
                  this.props.onClickPlayPause();
                }}
              >
                {(() => {
                  if (this.props.playAudio) {
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
                  this.props.onClickNextTrack();
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
          playing={this.props.playAudio}
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
}

export default PlayerControls;
