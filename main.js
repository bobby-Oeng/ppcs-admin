'use strict';

// Modules to control application life and create native browser window
const {app, electron, BrowserWindow, ipcMain, Menu, MenuItem, shell, dialog, webContents} = require('electron')
const path = require('path')
const url = require('url')
const mongoose = require("mongoose");
const updater = require("electron-updater");
const autoUpdater = updater.autoUpdater;
// const updater = require("./js/updater");

require('electron-reload')(__dirname);

const fs = require('fs');
const os = require('os');

let mainMenu = Menu.buildFromTemplate([
  {
    label: "File",
    submenu: [
      { label: "Product licensed info",
        click: () => {}},
      { label: "Change Password",
        click: () => { createChangePassWindow()}},
      { label: "Backup",
        click: () => {
          // const mongoURI = "mongodb://root:adminpwd@localhost:27017/tptwDB?authSource=admin";
          const mongoURI = "mongodb://localhost:27017/tptwDB";
          const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true
          };
          mongoose.connect(mongoURI, options);
          dialog.showSaveDialog(null, {
            defaultPath: __dirname + " backup"
          }, filepath => {
            var backup = require('mongodb-backup');
            backup({
              uri: uri,
              root: filepath,
              callback: function(err) {
                if(err) {
                  dialog.showMessageBox({message: err, buttons: ["Cancel"]})
                } else {
                  dialog.showMessageBox({message: "Backup completed!"});
                }
              }
            })
          });
          mongoose.connection.close()
        }},
      { label: "Print",
        click: () => {
          var window = BrowserWindow.getFocusedWindow();
          window.webContents.print({
              silent:false
          });
        }},
      { label: "Exit Application", role: "quit" },
    ]
  },
  {
    label: "Edit",
    submenu: [
      { role: "undo" },
      { role: "redo" },
      { role: "copy" },
      { role: "paste" },
    ]
  },
  {
    label: "Actions",
    submenu: [
      {
        label: "DevTools",
        role: "toggleDevTools"
      },
      {
        label: "Full Screen",
        role: "toggleFullScreen"
      },
      {
        label: "Reload",
        role: "reload"
      }
    ]
  }
])

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let changePassWindow
let adminWindow
let processListWindow
let userMachineWindow
let userSettingWindow
let addUserWindow
let machineSettingWindow
let addMachineWindow
let switchProcessWindow
let nearDueWindow
let overDueWindow

function createWindow () {


  function update() {
      autoUpdater.autoDownload = false

      autoUpdater.on('update-available', () => {
        dialog.showMessageBox(
           {
             message: "Update is available",
             buttons: ["Default Button", "Cancel Button"],
             defaultId: 0, // bound to buttons array
             cancelId: 1 // bound to buttons array
           })
           .then(result => {
             if (result.response === 0) {
               // bound to buttons array
               autoUpdater.downloadUpdate();
             }
           }
         );
      });
      autoUpdater.on('update-downloaded', () => {
        dialog.showMessageBox(
           {
             message: "Do you want to download now?",
             buttons: ["Yes", "Later"],
             defaultId: 0, // bound to buttons array
             cancelId: 1 // bound to buttons array
           })
          .then(result => {
            if (result.response === 0) {
              // bound to buttons array
              autoUpdater.quitAndInstall(false, true);
            }
          }
        );
      });
}
  // setTimeout( updater, 3000);

setTimeout(function() {
  update();
}, 3000);

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 500,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

//CREATE CHANGE PASSWORD WINDOW
function createChangePassWindow () {
  // Create the browser window.
  changePassWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  changePassWindow.loadFile('changePassWindow.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  changePassWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    changePassWindow = null
  })
}

//Create Admin Window
exports.createAdminWindow = () => {
  // Create the browser window.
  adminWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    // resizable: false,
    // maximizable: false,
    // transparent: true,
    darkTheme: true,
    // frame: false,
    scrollable: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })


  // and load the index.html of the app.
  adminWindow.loadFile('adminMainPage.html')

  Menu.setApplicationMenu(mainMenu);
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.

  // signinWindow.on('blur', () => {
  //     signinWindow.close();
  // })


  adminWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    adminWindow = null
  })
}

// Create Process List Window
exports.createOverDueWindow = () => {
  // Create the browser window.
  overDueWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    // resizable: false,
    // maximizable: false,
    // transparent: true,
    darkTheme: true,
    // frame: false,
    scrollable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })


  // and load the index.html of the app.
  overDueWindow.loadFile('overDue.html')

  Menu.setApplicationMenu(mainMenu);
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.

  // signinWindow.on('blur', () => {
  //     signinWindow.close();
  // })


  overDueWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    overDueWindow = null
  })
}


exports.createNearDueWindow = () => {
  // Create the browser window.
  nearDueWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    // resizable: false,
    // maximizable: false,
    // transparent: true,
    darkTheme: true,
    // frame: false,
    scrollable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })


  // and load the index.html of the app.
  nearDueWindow.loadFile('nearDue.html')

  Menu.setApplicationMenu(mainMenu);
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.

  // signinWindow.on('blur', () => {
  //     signinWindow.close();
  // })


  nearDueWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    nearDueWindow = null
  })
}


//Create Process List Window
exports.createProcessListWindow = () => {
  // Create the browser window.
  processListWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    // resizable: false,
    // maximizable: false,
    // transparent: true,
    darkTheme: true,
    // frame: false,
    scrollable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })


  // and load the index.html of the app.
  processListWindow.loadFile('pList.html')

  Menu.setApplicationMenu(mainMenu);
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.

  // signinWindow.on('blur', () => {
  //     signinWindow.close();
  // })


  processListWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    processListWindow = null
  })
}


// Create User&Machine Window
exports.createUserMachineWindow = () => {
  // Create the browser window.
  userMachineWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    // resizable: false,
    // maximizable: false,
    // transparent: true,
    darkTheme: true,
    // frame: false,
    scrollable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })


  // and load the index.html of the app.
  userMachineWindow.loadFile('userAndMachine.html')

  Menu.setApplicationMenu(mainMenu);
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.

  // signinWindow.on('blur', () => {
  //     signinWindow.close();
  // })


  userMachineWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    userMachineWindow = null
  })
}

//Create User setting window
exports.createUserSettingWindow = () => {
  // Create the browser window.
  userSettingWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    // resizable: false,
    // maximizable: false,
    // transparent: true,
    darkTheme: true,
    // frame: false,
    scrollable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })


  // and load the index.html of the app.
  userSettingWindow.loadFile('userSetting.html')

  Menu.setApplicationMenu(mainMenu);
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.

  // signinWindow.on('blur', () => {
  //     signinWindow.close();
  // })


  userSettingWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    userSettingWindow = null
  })
}


exports.addUserSettingWindow = () => {
  // Create the browser window.
  addUserWindow = new BrowserWindow({
    width: 1280,
    height: 400,
    parent: userSettingWindow,
    modal: true,
    // resizable: false,
    // maximizable: false,
    // transparent: true,
    darkTheme: true,
    // frame: false,
    scrollable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })


  // and load the index.html of the app.
  addUserWindow.loadFile('addUser.html')

  // Menu.setApplicationMenu(mainMenu);
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.

  // signinWindow.on('blur', () => {
  //     signinWindow.close();
  // })


  addUserWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    addUserWindow = null
  })
}


exports.createMachineSettingWindow = () => {
  // Create the browser window.
  machineSettingWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    parent: userSettingWindow,
    modal: true,
    // resizable: false,
    // maximizable: false,
    // transparent: true,
    darkTheme: true,
    // frame: false,
    scrollable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })


  // and load the index.html of the app.
  machineSettingWindow.loadFile('machineSetting.html')

  Menu.setApplicationMenu(mainMenu);
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.

  // signinWindow.on('blur', () => {
  //     signinWindow.close();
  // })


  machineSettingWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    machineSettingWindow = null
  })
}


exports.addMachineSettingWindow = () => {
  // Create the browser window.
  addMachineWindow = new BrowserWindow({
    width: 1280,
    height: 400,
    parent: machineSettingWindow,
    modal: true,
    // resizable: false,
    // maximizable: false,
    // transparent: true,
    darkTheme: true,
    // frame: false,
    scrollable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })


  // and load the index.html of the app.
  addMachineWindow.loadFile('addMachine.html')

  // Menu.setApplicationMenu(mainMenu);
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.

  // signinWindow.on('blur', () => {
  //     signinWindow.close();
  // })


  addMachineWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    addMachineWindow = null
  })
}


exports.createSwitchProcessWindow = () => {
  // Create the browser window.
  switchProcessWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    // resizable: false,
    // maximizable: false,
    // transparent: true,
    darkTheme: true,
    // frame: false,
    scrollable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })


  // and load the index.html of the app.
  switchProcessWindow.loadFile('switchProcess.html')

  Menu.setApplicationMenu(mainMenu);
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.

  // signinWindow.on('blur', () => {
  //     signinWindow.close();
  // })


  switchProcessWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    switchProcessWindow = null
  })
}




// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

var id;

ipcMain.on("sendIDtoMain", (e, args) => {
  id = args;
  // console.log(id);
  // e.sender.send("channel2Reply", userI);
})

ipcMain.on("request-for-id", (e, args) => {
  e.sender.send("response-from-main", id);
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
