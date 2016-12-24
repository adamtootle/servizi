import React, { Component, PropTypes } from 'react';
import ReactPlayer from 'react-player';
import IconButton from 'material-ui/IconButton';
import ActionPlayIcon from 'material-ui/svg-icons/av/play-arrow';
import ActionPauseIcon from 'material-ui/svg-icons/av/pause';
import ActionPreviousIcon from 'material-ui/svg-icons/av/skip-previous';
import ActionNextIcon from 'material-ui/svg-icons/av/skip-next';
import keys from '../lib/keys';

class PlayerControls extends Component {
  static propTypes = {
    selectedAttachment: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
  };

  static contextTypes = {
    player: PropTypes.object,
  };

  static defaultProps = {
    playAudio: false,
  };

  constructor(args) {
    super(args);

    this.selectedAttachmentId = -1;

    this.state = {
      selectedAttachmentUrl: null,
      playerTotalSeconds: 0,
      playerCurrentTime: 0,
      playAudio: false,
    };
  }

  componentDidMount() {
    this.loadSelectedAttachment();
  }

  componentWillReceiveProps(props) {
    this.setState({
      playAudio: props.playAudio,
    });
    if (props.selectedAttachment !== null && this.selectedAttachmentId !== props.selectedAttachment.id) {
      this.selectedAttachmentId = props.selectedAttachment.id;
      setTimeout(() => {
        this.loadSelectedAttachment();
      }, 0);
    }
  }

  loadSelectedAttachment() {
    if (this.props.selectedAttachment === null) {
      return;
    }

    this.setState({
      selectedAttachmentUrl: null,
      playAudio: false,
      playerTotalSeconds: 0,
      playerCurrentTime: 0,
    });

    window.apiClient.attachments.getAttachmentStreamUrl(this.props.selectedAttachment)
      .then((res) => {
        this.setState({
          selectedAttachmentUrl: res.data.attributes.attachment_url,
          playAudio: true,
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
            const elementRect = this.playerContainer.getBoundingClientRect();
            const newProgress = (ev.clientX - elementRect.left) / this.playerContainer.clientWidth;
            this.setState({
              playerCurrentTime: newProgress * this.state.playerTotalSeconds,
            });
            this.audioPlayer.seekTo(newProgress);
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
                  this.context.player.emit(keys.PlayPreviousAttachmentKey);
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
                  this.context.player.emit(keys.PlayPauseAttachmentKey);
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
                  this.context.player.emit(keys.PlayNextAttachmentKey);
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
          progressFrequency={500}
          playing={this.state.playAudio}
          width="100%"
          height="0px"
          onReady={() => {
            // console.log('onReady');
          }}
          onProgress={(progress) => {
            if (this.state.playerTotalSeconds > 0 && progress.played !== undefined) {
              this.setState({
                playerCurrentTime: Math.floor(this.state.playerTotalSeconds * progress.played),
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
