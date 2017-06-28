import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CircularProgress from 'material-ui/CircularProgress';
import { connect } from 'react-redux';
import PlayerControls from '../components/PlayerControls';
import AttachmentsList from '../components/AttachmentsList';
import VideoPlayer from '../VideoPlayer';
import { schedules as schedulesActions } from '../../redux/actions';

class SinglePlan extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.object,
    }),
    plans: PropTypes.shape({
      itemsAndAttachments: PropTypes.array,
      flattenedAttachments: PropTypes.array,
    }),
    player: PropTypes.shape({
      selectedVideoAttachment: PropTypes.object,
    }),
    ui: PropTypes.shape({
      showLoader: PropTypes.bool,
    }),
    dispatch: PropTypes.func,
  };
  static defaultProps = {};
  static contextTypes = {
    router: PropTypes.object,
    player: PropTypes.object,
    uiRoutePrefix: PropTypes.string,
  };

  componentDidMount() {
    this.props.dispatch(schedulesActions.selectPlan(parseInt(this.props.match.params.planId, 10)));
  }

  render() {
    if (this.props.ui.showLoader) {
      return null;
    }

    return (
      <div id="single-plan">
        {
          this.context.uiRoutePrefix === 'mini' ?
            <PlayerControls
              playAudio={this.state.playAudio}
              selectedAttachment={this.state.selectedAttachment}
            />
            : null
        }
        {
          this.props.player.selectedVideoAttachment ?
            <VideoPlayer
              selectedVideoAttachment={this.props.player.selectedVideoAttachment}
            />
            : null
        }
        <AttachmentsList />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    player: state.player,
    plans: state.plans,
    schedules: state.schedules,
    ui: state.ui,
  };
}

export default connect(mapStateToProps)(SinglePlan);
