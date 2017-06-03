const filter = require('lodash/filter');

module.exports = function (attachment, skippedAttachments) {
  return filter(skippedAttachments, skippedAttachment => skippedAttachment.relationships.attachment.data.id === attachment.id).length > 0;
}
