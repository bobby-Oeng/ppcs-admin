const remote = require('electron').remote;
const main = remote.require('./main.js');
const cWindow = remote.getCurrentWindow();
const ipc = require('electron').ipcRenderer;
const Worker = require("./js/workerSchema");
var vex = require('vex-js');
vex.registerPlugin(require('vex-dialog'));
// vex.defaultOptions.className = 'vex-theme-os'
vex.defaultOptions.className = 'vex-theme-default';

// const mongoURI = "mongodb://root:adminpwd@localhost:27017/tptwDB?authSource=admin";
const mongoURI = "mongodb://localhost:27017/tptwDB";
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};



// const Ppcs = require("./js/schema");
const mongoose = require("mongoose");


$("#confrimAddUser-btn").on("click", function() {
    vex.dialog.confirm({
      message: 'If you have confirmed all the details are correct, press OK to add new user.',
      callback: function (value) {
          if (value) {
            mongoose.connect(mongoURI, options);
            var name = $("#name-input").val();
            var cName = name.toUpperCase();
            const worker = new Worker({
              _id: $("#id-input").val(),
              name: cName
            });
            worker.save(function(err) {
              if(err) {
                vex.dialog.alert(err);
                cWindow.close();
              } else {
                mongoose.connection.close();
                new Notification("Worker has been saved successfully, Press F5 to refresh page.");
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
