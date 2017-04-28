import React, { Component, PropTypes } from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import { filter, findIndex } from 'lodash';
import PlayerControls from './PlayerControls';
import AttachmentsList from './AttachmentsList';
import VideoPlayer from './VideoPlayer';
import keys from '../lib/keys';
import settings from '../lib/settings';

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
    player: PropTypes.object,
    uiRoutePrefix: PropTypes.string,
  };

  constructor(args) {
    super(args);

    this.state = {
      plan: null,
      planItems: null,
      planAttachments: null,
      selectedAttachment: null,
      selectedVideoAttachment: null,
      playAudio: false,

    };
  }

  componentDidMount() {
    window.apiClient.plans.getPlan({
      serviceTypeId: this.props.params.service_type_id,
      planId: this.props.params.plan_id,
    })
    .then(window.apiClient.plans.getPlanItems)
    .then(window.apiClient.plans.getPlanAttachments)
    .then((res) => {
      const planAttachments = res.planAttachments;
      let newData = planAttachments.data;

      if (!settings.getStoredSettings().fullPlayerUI) {
        filter(planAttachments.data, attachment => attachment.attributes.pco_type === 'AttachmentS3');
      }

      if (this.context.uiRoutePrefix === 'full') {
        newData = planAttachments.data;
      }
      planAttachments.data = newData;
      this.setState({
        plan: res.plan,
        planItems: res.planItems,
        planAttachments,
      });
    });

    this.context.player.on(keys.PlayPreviousAttachmentKey, () => {
      this.handleClickPreviousTrack();
    });

    this.context.player.on(keys.PlayNextAttachmentKey, () => {
      this.handleClickNextTrack();
    });
  }

  getSelectedAttachmentIndex() {
    if (this.state.planAttachments !== null && this.state.selectedAttachment !== null) {
      return findIndex(this.state.planAttachments.data, attachmentToMatch => this.state.selectedAttachment.id === attachmentToMatch.id);
    }

    return -1;
  }

  handleGetSchedulesResponse = (ev, schedules) => {
    this.setState({
      schedules,
    });
  };

  handleClickAttachment = (selectedAttachment) => {
    const attachmentType = selectedAttachment.attributes.pco_type;
    if (attachmentType === 'AttachmentS3') {
      this.context.player.emit(keys.PlayAttachmentKey, selectedAttachment);
      this.setState({
        selectedVideoAttachment: null,
      });
    } else if (attachmentType === 'AttachmentVimeo' || attachmentType === 'AttachmentYoutube') {
      this.setState({
        selectedVideoAttachment: selectedAttachment,
      });
    }
    this.setState({
      selectedAttachment,
    });
  };

  handleClickPlayPause = () => {
    this.setState({
      playAudio: !this.state.playAudio,
    });
  }

  handleClickPreviousTrack = () => {
    if (this.getSelectedAttachmentIndex() > 0) {
      const newIndex = this.getSelectedAttachmentIndex() - 1;
      this.handleClickAttachment(this.state.planAttachments.data[newIndex]);
    } else {
      const newIndex = this.state.planAttachments.data.length - 1;
      this.handleClickAttachment(this.state.planAttachments.data[newIndex]);
    }
  }

  handleClickNextTrack = () => {
    if (this.getSelectedAttachmentIndex() < this.state.planAttachments.data.length - 1) {
      const newIndex = this.getSelectedAttachmentIndex() + 1;
      this.handleClickAttachment(this.state.planAttachments.data[newIndex]);
    } else {
      this.handleClickAttachment(this.state.planAttachments.data[0]);
    }
  }

  render() {
    if (this.state.planItems === null || this.state.planAttachments === null) {
      return (
        <div className="loading-indicator-wrapper" style={{ marginTop: '100px' }}>
          <CircularProgress />
        </div>
      );
    }

    const songItems = filter(this.state.planItems.data, item => item.attributes.item_type === 'song');

    return (
      <div className="single-plan-view">
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
          this.state.selectedVideoAttachment !== null ?
            <VideoPlayer
              selectedVideoAttachment={this.state.selectedVideoAttachment}
            />
            : null
        }
        <AttachmentsList
          songItems={songItems}
          planAttachments={this.state.planAttachments}
          selectedAttachment={this.state.selectedAttachment}
          onSelectAttachment={this.handleClickAttachment}
        />
      </div>
    );
  }
}

export default SinglePlanView;
