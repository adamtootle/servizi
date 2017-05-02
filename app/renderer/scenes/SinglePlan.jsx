import React, { Component, PropTypes } from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import { filter, findIndex } from 'lodash';
import { connect } from 'react-redux';
import PlayerControls from '../components/PlayerControls';
import AttachmentsList from '../components/AttachmentsList';
import VideoPlayer from '../VideoPlayer';
import keys from '../../main/keys';
import { schedules as schedulesActions } from '../../actions';

class SinglePlan extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.object,
    }),
  };
  static defaultProps = {};
  static contextTypes = {
    router: PropTypes.object,
    player: PropTypes.object,
    uiRoutePrefix: PropTypes.string,
  };

  componentDidMount() {
    this.props.dispatch(schedulesActions.selectPlan(parseInt(this.props.match.params.planId)));
  }

  render() {
    if (!this.props.plans.currentPlanItems || !this.props.plans.currentPlanAttachments) {
      return (
        <div className="loading-indicator-wrapper" style={{ marginTop: '100px' }}>
          <CircularProgress />
        </div>
      );
    }

    // const songItems = filter(this.props.plans.currentPlanItems.data, item => item.attributes.item_type === 'song');

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
          // http://vimeo.com/63300324
          // console.log(this.state.selectedAttachment);
          this.props.player.selectedVideoAttachment ?
            <VideoPlayer
              selectedVideoAttachment={this.props.player.selectedVideoAttachment}
            />
            : null
        }
        <AttachmentsList
          planAttachments={this.props.plans.currentPlanAttachments}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    player: state.player,
    plans: state.plans,
    schedules: state.schedules,
  };
}

export default connect(mapStateToProps)(SinglePlan);
