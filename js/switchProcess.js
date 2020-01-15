const remote = require('electron').remote;
const main = remote.require('./main.js')
const ipc = require('electron').ipcRenderer;
const cWindow = remote.getCurrentWindow();
const time = require("./js/formatTime.js");
// const dialog = remote.require('electron').dialog;
const Ppcs = require("./js/schema");
const Worker = require("./js/workerSchema");
const Machine = require("./js/machineSchema");
var vex = require('vex-js');
vex.registerPlugin(require('vex-dialog'));
vex.defaultOptions.className = 'vex-theme-default';
const mongoose = require("mongoose");
var Firebird = require('node-firebird');
const fireb = require("./js/firebird.js");
const dialog = require("./js/dialogF.js");
const mongo = require("./js/mongo.js");


// var titleId;
var fUser;
var joNo;
var process;
var processId;
var s = processId + "start";
var f = processId + "finish";
var mReceived;
var p1;
var p2;
var p3;
var p4;
var p5;
var p6;
var p7;
var p8;
var p9;
var p10;
var mReceived;
var fcustCode;
var fdeldate;
var fdrawingNo;
var fitemCode;
var fitemDesc;
var flocation;
var fqty;
var fuom;


// const mongoURI = "mongodb://root:adminpwd@localhost:27017/tptwDB?authSource=admin";
const mongoURI = "mongodb://localhost:27017/tptwDB";
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};


//##Firebird section
var fOptions = {};
// options.host = '192.168.0.188';
fOptions.host = '192.168.0.141'
fOptions.port = 3050;
fOptions.database = 'C:\\eStream\\SQLAccounting\\DB\\ACC-0063.FDB';
fOptions.user = 'SYSDBA';
fOptions.password = 'masterkey';
fOptions.lowercase_keys = false; // set to true to lowercase keys
fOptions.role = null;            // default
fOptions.pageSize = 4096;
//##Firebird section


$("#joInput").on("change", function() {
  $("#finishInput").toggle();
  var joNo = $("#joInput").val();
  mongoose.connect(mongoURI, options);
  Ppcs.findOne({_id: joNo}, function(err, foundJo) {
    if(err) {
      new Notification(err);
    } else {
      if(foundJo) {
        // dialog.promptUserMachine(joNo);//got Error, Need to fixed later 11-01-2020
        ipc.send("sendIDtoMain", joNo);
        dialog.pushNewProcess(joNo);
      } else {
        ipc.send("sendIDtoMain", joNo);
        fireb.materialStatus(joNo);
      }
    }
  })
  fireb.joProcessFlow(joNo);
})


$("#finishInput").on("change", function() {
  var finishJo = $("#finishInput").val();
  var originJo;
  ipc.send("request-for-id", "Hi");
  ipc.on("response-from-main", (e, args) => {
    originJo = args;
    if(originJo === finishJo) {
      dialog.finishProcess(finishJo);
    } else {
      vex.dialog.alert("The Jo Number you scanned is not same with the opened Jo Number! Operation aborted! System will auto refresh in 5 seconds...");
      setTimeout(function() {
        cWindow.reload();
      }, 5000);
    }
    // console.log("received from main: " + args);
  });
})


$("#logo").on("click", function() {
  mongoose.connection.close();
  main.createAdminWindow();
  cWindow.close();
})

$("#logOut-btn").on("click", function() {
  mongoose.connection.close();
  main.createWindow();
  cWindow.close();
})

$("#mainMenu-btn").on("click", function() {
  mongoose.connection.close();
  main.createAdminWindow();
  cWindow.close();
})
