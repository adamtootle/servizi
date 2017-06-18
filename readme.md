Servizi is a desktop music player for [Planning Center Services](https://planning.center/services/) written using [Electron](https://github.com/electron/electron), [React](https://github.com/facebook/react), and [Redux](https://github.com/reactjs/redux). It is a complete rewrite of an old project called PCS Player.

![screenshot-1](https://github.com/adamtootle/servizi/blob/master/screenshots/screenshot-1.png)

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
NOTE: Due to how macOS handles custom URL schemes while running dev apps, the OAuth flow with Planning Center will not work while using `npm run run-dev`. Instead, use `npm run build-prod` and then open `dist/mac/Servizi.app` to go through the OAuth flow. Once you've done that you can come back and use `npm run run-dev` to get webpack live reloading for dev purposes. The dev build will use the stored OAuth credentials from the production build.

## TODO

- ~~Multiple accounts support~~
- PDF attachment support
- Full song library support
- Offline playback
- Simultaneous track playback (for live tracking)
- MIDI/remote control for playback

## Feedback

[File an issue](https://github.com/adamtootle/servizi/issues)