const electronSettings = require('electron-settings');

class Settings {
  getStoredSettings() {
    let storedSettings = electronSettings.getSync('settings');
    if (storedSettings === null || storedSettings === undefined) {
      storedSettings = {
        fullPlayerUI: false,
      };
    }
    return storedSettings;
  }

  setStoredSettings(storedSettings) {
    electronSettings.setSync('settings', storedSettings);
  }
}

module.exports = new Settings();
