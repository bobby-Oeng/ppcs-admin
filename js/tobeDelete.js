const remote = require('electron').remote;
const main = remote.require('./main.js')
const ipc = require('electron').ipcRenderer;
const cWindow = remote.getCurrentWindow();
const time = require("./js/formatTime.js");
const dialog = remote.require('electron').dialog;
const Ppcs = require("./js/schema");
var vex = require('vex-js');
vex.registerPlugin(require('vex-dialog'));
vex.defaultOptions.className = 'vex-theme-default';
const mongoose = require("mongoose");
var Firebird = require('node-firebird');

//Mongoose EVENT


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


//##Firebird section
var options = {};

// options.host = '192.168.0.188';
options.host = '192.168.0.141'
options.port = 3050;
options.database = 'C:\\eStream\\SQLAccounting\\DB\\ACC-0063.FDB';
options.user = 'SYSDBA';
options.password = 'masterkey';
options.lowercase_keys = false; // set to true to lowercase keys
options.role = null;            // default
options.pageSize = 4096;
//##Firebird section

//START MONGOOSE CONNECTION
mongoose.connect('mongodb://localhost:27017/ppcsDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

$("#joInput").on("change", function() {
  joNo = $("#joInput").val();
  Firebird.attach(options, function(err, db) {
        db.on('attach', function() {
          console.log("Firebird is now attached in 1");
        });

        db.on('detach', function(isPoolConnection) {
          console.log("Firebird is now detach in 1");
        });

        db.on('error', function(err) {
          new Notification("ERROR WHILE CONNNECTING TO SQL ACCOUNTING!!");
        })

    if(err) {
      new Notification("ERROR WHILE CONNNECTING TO SQL ACCOUNTING!!");
    } else {
        if(db) {
          var sql2 = 'SELECT * FROM PD_JO WHERE DOCNO=' + Firebird.escape(joNo);
          db.query(sql2, function(err, result) {
            db.detach();
            result.forEach(function(f) {
              process = [f.UDF_P1, f.UDF_P2, f.UDF_P3, f.UDF_P4, f.UDF_P5, f.UDF_P6, f.UDF_P7, f.UDF_P8, f.UDF_P9, f.UDF_P10];

              for(var i = 0; i < 10; i++) {
                $("#sql-connect").append($("<a></a>").val(process[i]).html("P" +[i+1] + ": " + process[i]));
                $("a").addClass("dropdown-item");
              };//FOR LOOP
            })
          })
      } else {
        new Notification("ERROR WHILE CONNNECTING TO SQL ACCOUNTING!");
      }
    }
  });
  ipc.send("channel2", "Hello from channel2 usermainpage.js");
  ipc.on("channel2Reply", (e, args) => {
    $("#pName-navbar").text(args.role);
    $("#uName-navbar").text(args.name);
    //Find JONO yes or no
      Ppcs.findOne({_id: joNo}, function(err, foundJo) {
        if(err)
          throw(err)
          if(foundJo) {
            $("#joInput").hide();
            vex.dialog.prompt({
                message: 'Please enter your process ID',
                placeholder: 'Process ID.',
                callback: function (value) {
                    if(value) {
                      var sValue = value.toLowerCase()
                      var cValue = value.slice(0,2);
                      // console.log(sValue + "ishere");
                      Ppcs.find({"_id": joNo, "process._id": sValue}, function(err, foundId) {
                        if(err) {
                          new Notification(err);
                        } else {
                          // console.log(foundId);
                          //cut
                          if(foundId.length !== 0) {
                            mongoose.connection.close();
                            foundId.forEach(function(f) {

                              //SQL BODY
                              // console.log(foundId);
                              $(".sql-body").toggle();
                              $(".start-body").toggle();
                              $("#joNo-input").val(f._id);
                              $("#custCode-input").val(f.custCODE);
                              $("#itemCode-input").val(f.itemCode);
                              $("#itemDesc-input").val(f.itemDescription);
                              $("#delDate-input").val(f.delDate);
                              $("#drawNo").val(f.drawingNo);
                              $("#mReceived").prop("checked", true);
                              $("#finishInput").toggle();
                              $("#finishInput").focus();
                              //SQL BODY ENDED
                              f.process.forEach(function(p) {
                                if(p.info === sValue + "finish") {
                                  dialog.showMessageBox({message:"This Process ID is completed. Changes is not allowed!"});
                                  cWindow.reload();
                                } else {
                                  new Notification("Process ID found!", {body: "This process has already started!"})
                                  // $(".sql-body").toggle();
                                  ipc.send("sendIdToMain", sValue);
                                  console.log("sendIDtomain" + sValue);
                                  if(p._id === sValue) {
                                    $("#pId-input").val(p._id);
                                    $("#pName-input").val(p.name);
                                    $("#pStart-date-input").val(p.startDate);
                                    $("#pStart-time-input").val(p.startTime);
                                    $("#pStart-person-input").val(p.startUser);
                                    $("#pStart-machine-input").val(p.machine);
                                  }
                                }
                              })
                            })//foundID.foreach
                          } else {
                            Ppcs.findOne({_id: joNo}, function(err, result) {
                              if(err) {
                                console.log(err);
                              } else {
                                  new Notification("This process is not yet started.");
                                  vex.dialog.confirm({
                                    message: 'Are you absolutely sure you want to START the process?',
                                    callback: function (value) {
                                        if(value){
                                          vex.dialog.prompt({
                                            message: 'Please enter your process ID to start.',
                                            placeholder: 'Process ID',
                                            callback: function (value) {
                                                if(value) {
                                                  var sValue = value.toLowerCase();
                                                  var cValue = sValue.slice(0,2);
                                                  var npStartDate = new Date();
                                                  var npd = npStartDate.toLocaleDateString();
                                                  var npStartTime = time.formatAMPM(new Date());

                                                  vex.dialog.prompt({
                                                    message: "MACHINE NO",
                                                    placeholder: "PLEASE ENTER YOUR MACHINE NO.",
                                                    callback: function(value) {
                                                      if(value) {
                                                        var machineNo = value;

                                                        //MONGOOSE PUSH DATA HERE
                                                        // console.log(result);
                                                        Ppcs.updateMany({"_id": joNo}, {$push: {
                                                          process: [{
                                                            _id: sValue,
                                                            name: args.role,
                                                            position: cValue,
                                                            startDate: npd,
                                                            startTime: npStartTime,
                                                            startUser: args.name,
                                                            info: sValue+"start",
                                                            processStatus: "open",
                                                            machine: machineNo,
                                                            finishDate: "",
                                                            finishTime: "",
                                                            finishUser: "",
                                                            qty: ""
                                                          }]//PROCESS
                                                        }}, function(err) {
                                                          if(err) {
                                                            console.log(err);
                                                          } else {
                                                            mongoose.connection.close();

                                                            $(".sql-body").toggle();
                                                            //SQL BODY
                                                            $("#joNo-input").val(result._id);
                                                            $("#custCode-input").val(result.custCODE);
                                                            $("#itemCode-input").val(result.itemCode);
                                                            $("#itemDesc-input").val(result.itemDescription);
                                                            $("#delDate-input").val(result.delDate);
                                                            $("#drawNo").val(result.drawingNo);
                                                            $("#mReceived").prop("checked", true);
                                                            //SQL BODY ENDED

                                                            $(".start-body").toggle();
                                                            $("#pId-input").val(sValue);
                                                            $("#pName-input").val(args.role);
                                                            $("#pStart-date-input").val(npd);
                                                            $("#pStart-time-input").val(npStartTime);
                                                            $("#pStart-person-input").val(args.name);
                                                            $("#pStart-machine-input").val(machineNo);//Need to add machineNo
                                                            $("#finishInput").toggle();
                                                            $("#finishInput").focus();
                                                          }
                                                        });//UPDATE ONE

                                                        //SQL BODY, START BODY TOGGLE CODE(2);
                                                        ipc.send("sendIdToMain", sValue);
                                                      } else {
                                                        cWindow.reload();
                                                      }
                                                    }//vex prompt macine no call back
                                                  })//vex prompt macine no
                                                } else {
                                                  cWindow.reload();
                                                }//else
                                            }//VEX DIALOG PROMPT CALLBACK
                                          })//VEX DIALOG PROMPT
                                        } else {//IF Value
                                          cWindow.reload();
                                        }//VEX.DIALOG CONFIRM else
                                    }//VEX.DIALOG CONFIRM callback
                                })//VEX.DIALOG CONFIRM
                              }
                            })
                          }//else
                        }
                      })//ppcs.find
                    } else {
                      cWindow.reload();
                    }//if value
                }//callback value
            })//VEX>DIALOG>PROMPT
          } else { //IF FOUNDJO ELSE
            Firebird.attach(options, function(err, db) {
              db.on('attach', function() {
                  console.log("Firebird is now attached");
                });

                db.on('detach', function(isPoolConnection) {
                  console.log("Firebird is now detached");
                });
              if(err) {
                new Notification("Error while connecting to SQL Database. " + err);
              } else {
                //db = database
                var sql2 = 'SELECT * FROM PD_JO WHERE DOCNO=' + Firebird.escape(joNo);
                db.query(sql2, function(err, result) {
                  if(err)
                    throw err;
                  db.detach();
                  result.forEach(function(f) {
                    p1 = f.UDF_P1;
                    p2 = f.UDF_P2;
                    p3 = f.UDF_P3;
                    p4 = f.UDF_P4;
                    p5 = f.UDF_P5;
                    p6 = f.UDF_P6;
                    p7 = f.UDF_P7;
                    p8 = f.UDF_P8;
                    p9 = f.UDF_P9;
                    p10 = f.UDF_P10;
                    mReceived = f.UDF_M_RECEIVED;
                    fcustCode = f.CODE,
                    fdeldate = f.DELIVERYDATE,
                    fdrawingNo = f.ITEMCODE,
                    fitemCode = f.ITEMCODE,
                    fitemDesc = f.DESCRIPTION,
                    flocation = f.LOCATION,
                    fqty = f.QTY,
                    fuom = f.UOM
                  })//RESULT.FOR EACH
                  if(mReceived === "T") {
                    // var process;
                    vex.dialog.confirm({
                      message: 'PRESS OK TO START THE PROCESS.',
                      callback: function (value) {
                          if(value) {
                            vex.dialog.prompt({
                              message: 'PLEASE ENTER YOUR PROCESS ID.',
                              placeholder: 'Process ID.',
                              callback: function (value) {
                                  if(value) {
                                    var sValue = value.toLowerCase()
                                    var cValue = value.slice(0,2);
                                    var c = cValue + "._id";
                                    ipc.send("sendIdToMain", sValue);
                                    vex.dialog.prompt({
                                      message: "MACHINE NO",
                                      placeholder: "Enter your machine no here",
                                      callback: function (value) {
                                        if(value) {
                                            var machineNo = value;
                                          Ppcs.findOne({"_id": joNo, "process._id": sValue}, function(err, foundPid) {
                                            if(err)
                                              throw err
                                              if(foundPid) {
                                                console.log("foundPid");
                                              } else {
                                                var pStartDate = new Date();
                                                var pStartTime = time.formatAMPM(new Date());
                                                // var d = new Date("Fri Jan 31 2014 00:00:00 GMT-0800 (Pacific Standard Time)");
                                                var psd = pStartDate.toLocaleDateString();

                                                const ppcs = new Ppcs({
                                                  _id: joNo,
                                                  custCODE: fcustCode,
                                                  delDate: fdeldate,
                                                  drawingNo: fdrawingNo,
                                                  itemCode: fitemCode,
                                                  itemDescription: fitemDesc,
                                                  location: flocation,
                                                  materialReceived: mReceived,
                                                  qty: fqty,
                                                  status: "WIP",
                                                  process: [{
                                                    _id: sValue,
                                                    name: args.role,
                                                    position: cValue,
                                                    startDate: psd,
                                                    startTime: pStartTime,
                                                    startUser: args.name,
                                                    info: sValue + "start",
                                                    processStatus: "open",
                                                    machine: machineNo,
                                                    finishDate: "",
                                                    finishTime: "",
                                                    finishUser: "",
                                                    qty: ""
                                                  }]//p1
                                                });
                                                ppcs.save(function(err) {
                                                  if(err) {
                                                      new Notification("ERROR WHEN SAVE TO DATABASE!!");
                                                  } else {
                                                    // START BODY
                                                    $(".start-body").toggle();
                                                    $("#pId-input").val(sValue);
                                                    $("#pName-input").val(args.role);
                                                    $("#pStart-date-input").val(psd);
                                                    $("#pStart-time-input").val(pStartTime);
                                                    $("#pStart-person-input").val(args.name);
                                                    $("#pStart-machine-input").val(machineNo);
                                                    $("#finishInput").toggle();
                                                    $("#finishInput").focus();
                                                    //START BODY END
                                                    $(".sql-body").toggle();
                                                    mongoose.connection.close();
                                                    //SQL BODY
                                                    result.forEach(function(f){
                                                      $("#joNo-input").val(joNo);
                                                      $("#custCode-input").val(f.CODE);
                                                      $("#itemCode-input").val(f.ITEMCODE);
                                                      $("#itemDesc-input").val(f.DESCRIPTION);
                                                      $("#delDate-input").val(f.DELIVERYDATE);
                                                      $("#drawNo").val(f.ITEMCODE);
                                                      $("#mReceived").prop("checked", true);
                                                      $("#joInput").hide();
                                                    })
                                                    //SQL BODY ENDED
                                                    // mongoose.connection.close();
                                                    // mongoose.disconnect();
                                                  }//else
                                                })//New PPCS
                                              } //IF FOUND PIC ELSE
                                          });//PPCS>FINDONE
                                        } else {
                                          vex.dialog.alert("PROCESS HAS BEEN CANCELLED!");
                                        }
                                      }//prompt machine no function value
                                    })//prompt machine no
                                  }//If Value
                              }//VEX>PROMPT>CALLBACK
                          })//VEX.DIALOG>PROMPT
                          }//IF VALUE
                      }//DIALOG CONFIRM CALLBACK
                  })//VEX DIALOG CONFIRM
                  } else {
                    // mongoose.connection.close();
                    dialog.showMessageBox({message: "OPERATION ABORTED!", detail: "You cannot start this process due to Material Not Yet Received!"});
                    cWindow.reload();
                    // new Notification("OPERATION ABORTED!", {body: "You cannot start this process due to Material Not Yet Received!"})
                  }//IF MRECEIVED === T else {}
                })//DB.QUERY
              }
            }) //FIREBIRD.ATTACH
          } //ELSE
      })//PPCS.FINDONE(JONO);
  }); //IPC.ON("CHANNEL2");
}); //JOINPUT.ON(CHANGE);







$("#finishInput").on("change", function() {
  //START MONGOOSE CONNECTION
  mongoose.connect('mongodb://localhost:27017/ppcsDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  if($("#finishInput").val() === joNo) {
    vex.dialog.prompt({
      message: 'Please Enter Your Process ID.',
      placeholder: 'Process ID',
      callback: function (value) {
          if(value) {
            var sValue = value.toLowerCase();
            var cValue = sValue.slice(0, 2);
            ipc.send("sendHelloIdToMain", "Please give me process id");
            console.log("sendHellotomain");
            ipc.on("sendBackHello", (e, args) => {
              console.log("sendbackhello" + args);
              // console.log(sValue);
              if(sValue !== args) {
                dialog.showMessageBox({message: "Process ID is not match", detail: "Make sure you enter correct Process ID."});
                $("#finishInput").val("");
                $("#finishInput").focus();
                cWindow.reload();
              } else {
                vex.dialog.prompt({
                    message: 'Please enter Finish Qty.',
                    placeholder: 'Total Qty',
                    callback: function (value) {
                        if(value) {
                          var id = args.toLowerCase();
                          var pFinishDate = new Date();
                          var pFinishTime = time.formatAMPM(new Date());
                          var pfd = pFinishDate.toLocaleDateString();
                          // console.log(args + "" + machineNo + "" + value);
                          console.log(id);
                          ipc.send("requestUserInfo", "HelloToRequest");
                          ipc.on("sendUserInfoToFinishInput", (e, args) => {
                            Ppcs.updateMany({"process._id": id}, {"$set": {
                              "process.$.finishDate": pfd,
                              "process.$.finishTime": pFinishTime,
                              "process.$.finishUser": args.name,
                              // "process.$.machine": machineNo,
                              "process.$.qty": value,
                              "process.$.info": id + "finish",
                              "process.$.processStatus": "close"
                              // "process.$.finishDate": fDate,
                            }}, function(err){
                              if(err) {
                                console.log(err);
                              } else {
                                mongoose.connection.close();
                                $("#finishInput").hide();
                                // ipc.send("requestUserInfo", "HelloToRequest");
                                // ipc.on("sendUserInfoToFinishInput", (e, args) => {
                                  // //LOAD FINISH BODY HERE
                                  $(".finish-body").toggle();
                                  $("#pfName-input").val(args.role);
                                  $("#pFinish-date-input").val(pfd);
                                  $("#pFinish-time-input").val(pFinishTime);
                                  $("#pFinish-person-input").val(args.name);
                                  $("#pFinish-qty-input").val(value);
                                  new Notification("Successfully updated.")
                                // })//IPC>ON"SENDUSERINFO
                              }//else
                            })//Ppcs.updatemany CALLBACK
                          })
                          // mongoose.connection.close();
                        } else {
                          dialog.showMessageBox({message: "Please restart the finish process again", detail: "Make sure you enter Finish Qty."});
                        } //else
                    }//VEX PROMPT FINISH QTY call back
                })//VEX PROMPT FINISH QTY
                // dialog.showMessageBox({message: "Process is successfully Completed!"});
              }//ELSE
            });//IPC ON
          }//IF VALUE
      } //VEX.PROMPT CALLBACK
  });//VEX.PROMPT
} else { //IF SCAN FINISH JONO NOT == SCAN START JO NUMBER
    vex.dialog.alert("FINISH JO NUMBER MUST BE SAME WITH START NUMBER!")
  }

});//FINISH ON CLICK END

$("#newProcess-btn").on("click", function() {
  cWindow.reload();
});


$("#admin-page").on("click", () => {
  main.createAdminWindow();
  cWindow.close();
});

$("#log-out-btn").on("click", function() {
  main.createWindow();
  cWindow.close();
})
// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function() {
  console.log('successfully connected to the databse ');
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

//FIREBIRD CONNECTION EVENT



// document.getElementById('pStart-date-input').valueAsDate = new Date();
// document.getElementById('pFinish-date-input').valueAsDate = new Date();
