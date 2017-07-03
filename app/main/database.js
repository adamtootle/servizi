const utils = require('./utils');
const NeDB = require('nedb');
const CryptoJS = require('crypto-js');
const config = require('../../config');
const electron = utils.isRenderer() ? require('electron').remote : require('electron');

const app = electron.app;

const dbRoot = `${app.getPath('userData')}/db`;

function afterSerialization(string) {
  if (string) {
    return CryptoJS.AES.encrypt(string, config.dbSecret);
  }

  return null;
}

function beforeDeserialization(string) {
  if (string) {
    const bytes = CryptoJS.AES.decrypt(string.toString(), config.dbSecret);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  return null;
}

module.exports = {
  accounts: new NeDB({
    filename: `${dbRoot}/accounts`,
    autoload: true,
    afterSerialization,
    beforeDeserialization,
  }),
  settings: new NeDB({
    filename: `${dbRoot}/settings`,
    autoload: true,
    afterSerialization,
    beforeDeserialization,
  }),
};
