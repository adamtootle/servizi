const AWS = require('aws-sdk');
const AMA = require('aws-sdk-mobile-analytics');
const logger = require('electron-log');
const utils = require('./utils');
const config = require('../../config');

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
};

const analyticsClient = new AMA.Manager(options);

module.exports = {
  recordEvent: function recordEvent(eventName, attributes, metrics) {
    if (utils.isDev()) {
      logger.info('not logging the following AWS event in dev environment');
      logger.info('name: ', eventName);
      logger.info('attributes: ', attributes);
      logger.info('metrics: ', metrics);
    } else {
      analyticsClient.recordEvent(eventName, attributes, metrics);
    }
  },
};
