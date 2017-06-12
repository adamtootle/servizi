import React, { Component } from 'react';
import { List, ListItem } from 'material-ui/List';
import CircularProgress from 'material-ui/CircularProgress';

export default class SongsList extends Component {
  constructor(args) {
    super(args);

    this.state = {
      songs: [],
      selectedSong: null,
    };
  }

  componentDidMount() {
    window.apiClient.songs.getSongs()
      .then((res) => {
        this.setState({
          songs: res.data,
        });
      });
  }

  render() {
    return (
      <List
        id="songs-list-container"
        onScroll={() => {
          console.log('scroll');
        }}
      >
        {this.state.songs.map((song) => {
          const itemIsSelected = this.state.selectedSong !== null && this.state.selectedSong.id === song.id;
          const style = {
            backgroundColor: itemIsSelected ? 'rgba(0, 0, 0, 0.05)' : '',
            color: '#2E2E2E',
          };
          return (
            <ListItem
              key={song.id}
              primaryText={song.attributes.title}
              secondaryText={song.attributes.author}
              style={style}
              onClick={() => {
                this.setState({
                  selectedSong: song,
                });
              }}
            />
          );
        })}
        <ListItem
          key="loding-indicator"
        >
          <div
            className="loading-indicator-wrapper"
            style={{
              marginTop: '10px',
            }}
          >
            <CircularProgress size={30} />
          </div>
        </ListItem>
      </List>
    );
  }
}
