// const remote = require('electron').remote;
// const main = remote.require('./main.js');
// const dialog = remote.require('electron').dialog;
const {autoUpdater} = require("electron-updater");
// const dialog = remote.require('electron').dialog;

module.exports = () => {
  console.log('Checking for update');
  autoUpdater.checkForUpdates(); 
}
