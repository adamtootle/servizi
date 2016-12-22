import React, { Component, PropTypes } from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import { filter, findIndex } from 'lodash';
import { ipcRenderer } from 'electron';
import PlayerControls from './PlayerControls';
import AttachmentsList from './AttachmentsList';

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
    uiRoutePrefix: PropTypes.string,
  };

  constructor(args) {
    super(args);

    this.state = {
      plan: null,
      planItems: null,
      planAttachments: null,
      selectedAttachment: null,
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
    this.setState({
      selectedAttachment,
      playAudio: true,
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
      <div>
        <PlayerControls
          playAudio={this.state.playAudio}
          selectedAttachment={this.state.selectedAttachment}
          onClickPlayPause={this.handleClickPlayPause}
          onClickPreviousTrack={this.handleClickPreviousTrack}
          onClickNextTrack={this.handleClickNextTrack}
        />
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
