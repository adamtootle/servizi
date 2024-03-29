import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import IconButton from 'material-ui/IconButton';
import ActionPlayIcon from 'material-ui/svg-icons/av/play-arrow';
import ActionPauseIcon from 'material-ui/svg-icons/av/pause';
import ActionPreviousIcon from 'material-ui/svg-icons/av/skip-previous';
import ActionNextIcon from 'material-ui/svg-icons/av/skip-next';
import ActionRepeatIcon from 'material-ui/svg-icons/av/repeat';
import formatDuration from 'format-duration';
import keys from '../../main/keys';
import { player as playerActions } from '../../redux/actions';
import analytics from '../../main/analytics';
import config from '../../../config';

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
                analytics.recordEvent(config.aws.eventNames.previousAttachment, {
                  method: 'mouse',
                });
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

                if (this.props.player.playAudio) {
                  // already playing, so we're pausing it
                  analytics.recordEvent(config.aws.eventNames.pauseAttachment, {
                    method: 'mouse',
                  });
                } else {
                  // already paused, so we're playing it
                  analytics.recordEvent(config.aws.eventNames.playAttachment, {
                    method: 'mouse',
                  });
                }

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
                analytics.recordEvent(config.aws.eventNames.nextAttachment, {
                  method: 'mouse',
                });
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
                analytics.recordEvent(config.aws.eventNames.seekTime);
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
                color: this.props.player.repeat ? '#5DBCE5' : '#C1C1C1',
              })}
              style={styles.trackControlButton}
              onClick={(ev) => {
                ev.preventDefault();
                ev.stopPropagation();

                if (this.props.player.repeat) {
                  // already enabled, so we're disabling it
                  analytics.recordEvent(config.aws.eventNames.selectRepeat, {
                    enable: false,
                  });
                } else {
                  // already disabled, so we're enabling it
                  analytics.recordEvent(config.aws.eventNames.selectRepeat, {
                    enable: true,
                  });
                }

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
