module.exports = function attachmentIsSupported(attachment) {
  const { attributes } = attachment;
  return attributes.content_type === 'audio/mpeg'
          || attributes.pco_type === 'AttachmentYoutube'
          || attributes.pco_type === 'AttachmentVimeo';
};
