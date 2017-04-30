import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ReactPlayer from 'react-player';
import IconButton from 'material-ui/IconButton';
import ActionPlayIcon from 'material-ui/svg-icons/av/play-arrow';
import ActionPauseIcon from 'material-ui/svg-icons/av/pause';
import ActionPreviousIcon from 'material-ui/svg-icons/av/skip-previous';
import ActionNextIcon from 'material-ui/svg-icons/av/skip-next';
import formatDuration from 'format-duration';
import keys from '../../main/keys';
import { player as playerActions } from '../../actions';

class PlayerControls extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    player: PropTypes.shape({
      selectedAttachmentUrl: PropTypes.string,
      playAudio: PropTypes.bool,
      currentSecond: PropTypes.number,
      totalSeconds: PropTypes.number,
    }),
  };

  static contextTypes = {
    player: PropTypes.object,
  };

  static defaultProps = {
    playAudio: false,
  };

  render() {
    let playerProgressBarPercentageWidth = (this.props.player.currentSecond / this.props.player.totalSeconds) * 100;

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
            const currentSecond = newProgress * this.props.player.totalSeconds;
            this.props.dispatch(playerActions.currentAttachmentTime({ currentSecond }));
            this.audioPlayer.seekTo(newProgress);
          }}
        >
          <div
            id="player-progress-bar"
            style={{
              width: `${playerProgressBarPercentageWidth}%`,
            }}
          />
          <div id="player-controls">
            <span id="player-timestamp">
              {formatDuration(this.props.player.currentSecond * 1000)}/{formatDuration(this.props.player.totalSeconds * 1000)}
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
                  this.props.dispatch(playerActions.previousAttachment());
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
                  this.props.dispatch(playerActions.playPauseAttachment());
                }}
              >
                {(() => {
                  if (this.props.player.playAudio) {
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
                  this.props.dispatch(playerActions.nextAttachment());
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
          url={this.props.player.selectedAttachmentUrl}
          progressFrequency={500}
          playing={this.props.player.playAudio}
          width="100%"
          height="0px"
          onReady={() => {
            // console.log('onReady');
          }}
          onProgress={(progress) => {
            if (this.props.player.totalSeconds > 0 && progress.played !== undefined) {
              const currentSecond = Math.floor(this.props.player.totalSeconds * progress.played);
              this.props.dispatch(playerActions.currentAttachmentTime({ currentSecond }));
            }
          }}
          onDuration={(totalSeconds) => {
            this.props.dispatch(playerActions.currentAttachmentTime({ totalSeconds }));
          }}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { player: state.player };
}

export default connect(mapStateToProps)(PlayerControls);
