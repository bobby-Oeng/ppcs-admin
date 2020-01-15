const remote = require('electron').remote;
const main = remote.require('./main.js');
const cWindow = remote.getCurrentWindow();
const ipc = require('electron').ipcRenderer;


$("#user-enter").on("click", function() {
  main.createUserSettingWindow();
  cWindow.close();
})

$("#machine-enter").on("click", function() {
  main.createMachineSettingWindow();
  cWindow.close();
})

$("#logo").on("click", function() {
  main.createAdminWindow();
  cWindow.close();
})

$("#logOut-btn").on("click", function() {
  main.createWindow();
  cWindow.close();
})
