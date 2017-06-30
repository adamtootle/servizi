const AWS = require('aws-sdk');
const AMA = require('aws-sdk-mobile-analytics');
const logger = require('electron-log');
const utils = require('./utils');
const config = require('../../config');

const platform = process.platform === 'darwin' ? 'MacOS' : 'Windows,';

AWS.config.region = 'us-east-1';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: config.aws.IdentityPoolId,
});

const options = {
  appId: config.aws.appId,
  appTitle: config.aws.appTitle,
  appVersionName: config.aws.appVersionName,
  appVersionCode: config.aws.appVersionCode,
  appPackageName: config.aws.appPackageName,
  logger: utils.isDev() ? console : null,
  platform,
};

const analyticsClient = new AMA.Manager(options);

module.exports = {
  recordEvent: function recordEvent(eventName, attributes, metrics) {
    analyticsClient.recordEvent(eventName, attributes, metrics);
  },
};
