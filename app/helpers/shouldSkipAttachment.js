const filter = require('lodash/filter');

module.exports = function shouldSkipAttachment(attachment, skippedAttachments) {
  return filter(skippedAttachments, skippedAttachment => skippedAttachment.relationships.attachment.data.id === attachment.id).length > 0;
};
