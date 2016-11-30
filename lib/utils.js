module.exports = {
  // taken from https://github.com/jprichardson/is-electron-renderer
  isRenderer: () => {
    // node-integration is disabled
    if (!process) return true;

    // We're in node.js somehow
    if (!process.type) return false;

    return process.type === 'renderer';
  },
};
