import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import IconButton from 'material-ui/IconButton';
import ActionPlayIcon from 'material-ui/svg-icons/av/play-arrow';
import ActionPauseIcon from 'material-ui/svg-icons/av/pause';
import ActionPreviousIcon from 'material-ui/svg-icons/av/skip-previous';
import ActionNextIcon from 'material-ui/svg-icons/av/skip-next';
import ActionRepeatIcon from 'material-ui/svg-icons/av/repeat';
import formatDuration from 'format-duration';
import keys from '../../main/keys';
import { player as playerActions } from '../../actions';

const styles = {
  trackControlIcon: {
    width: 32,
    height: 32,
    color: '#535353',
  },
  trackControlButton: {
    width: 60,
    height: 60,
    padding: 0,
  }
};

class PlayerControls extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    player: PropTypes.shape({
      selectedAttachmentUrl: PropTypes.string,
      playAudio: PropTypes.bool,
      currentSecond: PropTypes.number,
      totalSeconds: PropTypes.number,
      player: PropTypes.object,
    }),
    playerRef: PropTypes.object,
  };

  static contextTypes = {
    player: PropTypes.object,
  };

  render() {
    let playerProgressBarPercentageWidth = (this.props.player.currentSecond / this.props.player.totalSeconds) * 100;

    if (isNaN(playerProgressBarPercentageWidth)) {
      playerProgressBarPercentageWidth = 0;
    }

    return (
      <div id="player-container-wrapper">
        <div id="player-container">
          <div style={{ width: 15 }} />
          <div id="track-controls">
            <IconButton
              ref={(ref) => {
                this.previousButton = ref;
              }}
              iconStyle={styles.trackControlIcon}
              style={styles.trackControlButton}
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
              iconStyle={styles.trackControlIcon}
              style={styles.trackControlButton}
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
              iconStyle={styles.trackControlIcon}
              style={styles.trackControlButton}
              onClick={(ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                this.props.dispatch(playerActions.nextAttachment());
              }}
            >
              <ActionNextIcon />
            </IconButton>
          </div>
          <div style={{ width: 20 }} />
          <div id="player-time">
            <span className="timestamp">
              {formatDuration(this.props.player.currentSecond * 1000)}
            </span>
            <div style={{ width: 15 }} />
            <div
              id="player-time-bar-container"
              ref={(ref) => {
                this.playerContainer = ref;
              }}
              onClick={(ev) => {
                const elementRect = this.playerContainer.getBoundingClientRect();
                const newProgress = (ev.clientX - elementRect.left) / this.playerContainer.clientWidth;
                const currentSecond = newProgress * this.props.player.totalSeconds;
                this.props.dispatch(playerActions.currentAttachmentTime({ currentSecond }));
                this.props.playerRef.seekTo(newProgress);
              }}
            >
              <div id="player-time-bar-gray">
                <div
                  id="player-time-bar-blue"
                  style={{
                    width: `${playerProgressBarPercentageWidth}%`,
                  }}
                />
              </div>

            </div>
            <div style={{ width: 15 }} />
            <span className="timestamp">
              {formatDuration(this.props.player.totalSeconds * 1000)}
            </span>
          </div>
          <div style={{ width: 20 }} />
          <div id="extra-controls">
            <IconButton
              ref={(ref) => {
                this.nextButton = ref;
              }}
              iconStyle={Object.assign({}, styles.trackControlIcon, {
                color: this.props.player.repeat ? '#71C7FF' : '#C1C1C1',
              })}
              style={styles.trackControlButton}
              onClick={(ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                this.props.dispatch(playerActions.repeat());
              }}
            >
              <ActionRepeatIcon />
            </IconButton>
          </div>
        </div>

      </div>
    );
  }
}

function mapStateToProps(state) {
  return { player: state.player };
}

export default connect(mapStateToProps)(PlayerControls);
