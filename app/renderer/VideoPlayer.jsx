import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';

class VideoPlayer extends Component {
  static propTypes = {
    selectedVideoAttachment: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
  };

  static contextTypes = {
    player: PropTypes.object,
  };

  static defaultProps = {
    playVideo: false,
  };

  constructor(args) {
    super(args);

    this.selectedVideoAttachmentId = -1;

    this.state = {
      selectedVideoAttachmentUrl: null,
      playerTotalSeconds: 0,
      playerCurrentTime: 0,
      playVideo: false,
    };
  }

  componentDidMount() {
    this.loadSelectedVideoAttachment();
  }

  componentWillReceiveProps(props) {
    this.setState({
      playVideo: props.playVideo,
    });
    if (props.selectedVideoAttachment !== null && this.selectedVideoAttachmentId !== props.selectedVideoAttachment.id) {
      this.selectedVideoAttachmentId = props.selectedVideoAttachment.id;
      setTimeout(() => {
        this.loadSelectedVideoAttachment();
      }, 0);
    }
  }

  loadSelectedVideoAttachment() {
    if (this.props.selectedVideoAttachment === null) {
      return;
    }

    this.setState({
      selectedAttachmentUrl: null,
      playVideo: false,
      playerTotalSeconds: 0,
      playerCurrentTime: 0,
    });

    window.apiClient.attachments.getAttachmentStreamUrl(this.props.selectedVideoAttachment)
      .then((res) => {
        this.setState({
          selectedVideoAttachmentUrl: res.data.attributes.attachment_url,
          playVideo: true,
        });
      });
  }

  render() {
    return (
      <div id="video-player">
        <ReactPlayer
          ref={(ref) => {
            this.videoPlayer = ref;
          }}
          url={this.state.selectedVideoAttachmentUrl}
          playing
          controls
        />
      </div>
    );
  }
}

export default VideoPlayer;
