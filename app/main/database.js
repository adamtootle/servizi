const utils = require('./utils');
const NeDB = require('nedb');
const CryptoJS = require('crypto-js');
const config = require('../../config');
const electron = utils.isRenderer() ? require('electron').remote : require('electron');

const app = electron.app;

module.exports = new NeDB({
  filename: `${app.getPath('appData')}/Servizi/database`,
  autoload: true,
  afterSerialization: (string) => {
    if (string) {
      return CryptoJS.AES.encrypt(string, config.dbSecret);
    }

    return null;
  },
  beforeDeserialization: (string) => {
    if (string) {
      const bytes = CryptoJS.AES.decrypt(string.toString(), config.dbSecret);
      return bytes.toString(CryptoJS.enc.Utf8);
    }

    return null;
  },
});
