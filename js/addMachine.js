const remote = require('electron').remote;
const main = remote.require('./main.js');
const cWindow = remote.getCurrentWindow();
const ipc = require('electron').ipcRenderer;
const Machine = require("./js/machineSchema");
var vex = require('vex-js');
vex.registerPlugin(require('vex-dialog'));
// vex.defaultOptions.className = 'vex-theme-os'
vex.defaultOptions.className = 'vex-theme-default';
// const Ppcs = require("./js/schema");
const mongoose = require("mongoose");
// const mongoURI = "mongodb://root:adminpwd@localhost:27017/tptwDB?authSource=admin";
const mongoURI = "mongodb://localhost:27017/tptwDB";
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};




$("#confrimAddMachine-btn").on("click", function() {
    vex.dialog.confirm({
      message: 'If you have confirmed all the details are correct, press OK to add new machine.',
      callback: function (value) {
          if (value) {
            mongoose.connect(mongoURI, options);
            var name = $("#name-input").val();
            var cName = name.toUpperCase();
            var pName = $("#processName-input").val();
            const machine = new Machine({
              _id: $("#id-input").val(),
              name: cName,
              processName: pName,
              status: "NIL"
            });
            machine.save(function(err) {
              if(err) {
                vex.dialog.alert(err);
                setTimeout(function(){
                  cWindow.close();
                }, 2000);
              } else {
                mongoose.connection.close();
                new Notification("Machine has been saved successfully, Press F5 to refresh page.");
                setTimeout(function(){
                  cWindow.close();
                }, 1000);
              }
            })
          } else {
            cWindow.close();
          }
      }
  })
})


// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function() {
  console.log('successfully connected to the databse');
});

// If the connection throws an error
mongoose.connection.on('error', function(err) {
  console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function() {
  console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
  mongoose.connection.close(function() {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});
