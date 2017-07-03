Servizi is a desktop music player for [Planning Center Services](https://planning.center/services/) written using [Electron](https://github.com/electron/electron), [React](https://github.com/facebook/react), and [Redux](https://github.com/reactjs/redux). It is a complete rewrite of an old project called PCS Player.

[Download for macOS](http://servizi.s3.amazonaws.com/releases/Servizi-1.0.0.dmg)

[Download for Windows](http://servizi.s3.amazonaws.com/releases/Servizi%20Setup%201.0.0.exe) (unsigned and will trigger warnings)

![screenshot-1](https://raw.githubusercontent.com/adamtootle/servizi/85463176a66edbd55c81f09762d314d75da3cfbc/screenshots/screenshot-1.jpg)

## Run locally

```
git clone https://github.com/adamtootle/servizi.git
npm install
```
[Webpack](https://github.com/webpack/webpack) handles bundling all frontend javascript for powering the UI.
```
npm run webpack-server
```
And finally, launch the actual music player with:
```
npm run run-dev
```

## TODO

- ~~Multiple accounts support~~
- PDF attachment support
- Full song library support
- Offline playback
- Simultaneous track playback (for live tracking/practice)
- MIDI/remote control for playback

## Feedback

[Create an issue](https://github.com/adamtootle/servizi/issues)