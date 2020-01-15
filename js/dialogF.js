function alertMissionAborted() {
  vex.dialog.alert("Mission aborted!");
  setTimeout(function(){
    cWindow.reload();
  }, 2000);
}


function openItNow(joNo, foundOpMachine) {
  foundOpMachine.forEach(function(f) {
    f.process.forEach(function(p) {
      processName = p.processName;
      startDate = p.startDate;
      startTime = p.startTime;
      startWorker = p.startWorker;
      startMachine = p.machine;
    })
  });
  //START BODY END
  $(".start-body").toggle();
  $("#pName-input").val(processName);
  $("#pStart-date-input").val(startDate);
  $("#pStart-time-input").val(startTime);
  $("#pStart-person-input").val(startWorker);
  $("#pStart-machine-input").val(startMachine);
  $("#finishInput").toggle();
  $("#finishInput").focus();
  //START SQL BODY
  mongo.toggeleSqlBody(joNo);
  new Notification("Process found! Scan again to finish this process")
}

exports.createFirstProcess = (joNo) => {
  vex.dialog.prompt({
    message: 'Please scan your worker ID...',
    placeholder: 'Worker ID',
    callback: function (value) {
      if(value) {
        var workerID = value;
        vex.dialog.prompt({
          message: 'Please scan your machine ID...',
          placeholder: 'Machine ID',
          callback: function (value) {
            if(value) {
              var machineNo = value;
              // console.log("this is new process");
              // console.log(machineNo, workerID, joNo);
              // db.articles.find({ stock : { $elemMatch : { country : "01", "warehouse.code" : "02" } } }).pretty();
              Ppcs.find({process: { $elemMatch : { machine: machineNo, processStatus: "OPEN"}}}, function(err, foundOpMachine) {
              // Ppcs.findOne({"process.machine": machineNo}, {"process.processStatus.$": "OPEN"}, function(err, foundOpMachine) {
                if(err) {
                  new Notification(err);
                } else {
                  if(foundOpMachine.length === 0 ) {
                    console.log("No machine found");
                    var processName;
                    var startDate;
                    var startTime;
                    var startWorker;
                    var startMachine;
                    mongo.createFirstProcess(machineNo, workerID, joNo);
                  //   foundOpMachine.process.forEach(function(f) {
                  //     if(f.processStatus === "OPEN") {
                  //
                  //       if(joNo === foundOpMachine._id) {
                  //         console.log("Open");
                  //         openItNow(joNo, foundOpMachine);
                  //         $("#finishInput").toggle();
                  //         $("#finishInput").focus();
                  //       } else {
                  //         mongoose.connection.close();
                  //         vex.dialog.alert("Machine is In Use in another JO, you cannot start a new process! System will auto refresh in 5 seconds..");
                  //         setTimeout(function() {
                  //           cWindow.reload();
                  //         }, 5000);
                  //       }
                  //     } else {
                  //       //PUSH NEW PROCESS;
                  //       mongo.pushNewProcess(machineNo, workerID, joNo);
                  //     }
                  //   })
                  // } else {
                  //   mongo.pushNewProcess(machineNo, workerID, joNo);
                  // }

                    // foundOpMachine.process.forEach(function(f) {
                    //   if(f.processStatus === "OPEN") {
                    //     console.log("machine is open");
                    //     vex.dialog.alert("Machine is In Use in another JO, you cannot start a new process! System will auto refresh in 5 seconds..");
                    //       setTimeout(function() {
                    //         cWindow.reload();
                    //       }, 5000);
                    //   } else {
                    //     console.log(f.processStatus);
                    //     console.log("else");
                    //     //create first proccess
                    //     // mongo.createFirstProcess(machineNo, workerID, joNo);
                    //   }
                    // })
                  } else {
                    mongoose.connection.close();
                    vex.dialog.alert("Machine is opened in another JO, operation aborted...System will auto refresh in 3 seconds");
                    setTimeout(function() {
                      cWindow.reload();
                    }, 3000);
                    // vex.dialog.alert("Invalid Machine ID, system will auto refresh in 3 seconds!...");
                    // setTimeout(function() {
                    //   cWindow.reload();
                    // }, 3000);
                  }
                }
              })
            }
          }
        });
      }
    }
  })
}


exports.pushNewProcess = (joNo) => {
    vex.dialog.prompt({
      message: 'Please scan your worker ID...',
      placeholder: 'Worker ID',
      callback: function (value) {
          if(value) {
              var workerID = value;
              vex.dialog.prompt({
                message: 'Please scan your machine ID...',
                placeholder: 'Machine ID',
                callback: function (value) {
                    if(value) {

                      var machineNo = value;
                      // db.testing.findOne({ _id: "id1", "array.active" : 1 }, { "array.$": 1 });
                      Machine.findOne({"_id": machineNo}, function(err, foundM) {
                        if(err) {
                          new Notification(err);
                        } else {
                          if(foundM) {
                            // Ppcs.findOne({"process.machine": machineNo}, {"process.processStatus.$": "OPEN"}, function(err, foundOpMachine) {
                            Ppcs.find({process: { $elemMatch : { machine: machineNo, processStatus: "OPEN"}}}, function(err, foundOpMachine) {
                              if(err) {
                                console.log(err);
                              } else {
                                if(foundOpMachine.length === 0 ) {
                                  console.log("No open machine found");
                                  var processName;
                                  var startDate;
                                  var startTime;
                                  var startWorker;
                                  var startMachine;
                                  mongo.pushNewProcess(machineNo, workerID, joNo);
                                } else {
                                  // mongo.pushNewProcess(machineNo, workerID, joNo);
                                  foundOpMachine.forEach(function(m) {
                                    if(joNo === m._id) {
                                      openItNow(joNo, foundOpMachine);
                                        $("#finishInput").toggle();
                                        $("#finishInput").focus();
                                    } else {
                                      vex.dialog.alert("Machine is In Use in another JO, you cannot start a new process! System will auto refresh in 5 seconds..");
                                      setTimeout(function() {
                                        cWindow.reload();
                                      }, 5000);
                                    }
                                  })
                                }
                              }
                            })


                          } else {
                            mongoose.connection.close();
                            vex.dialog.alert("Invalid Machine ID, system will auto refresh in 3 seconds!...");
                            setTimeout(function() {
                              cWindow.reload();
                            }, 3000);
                          }
                        }
                      })
                    } else {
                      alertMissionAborted();
                    }
                }
            })
          } else {
            alertMissionAborted();
          }
      }
  })
}
//END OF PROMPT promptUserMachine

exports.finishProcess = (joNo) => {
    vex.dialog.prompt({
      message: 'Please scan your worker ID...',
      placeholder: 'Worker ID',
      callback: function (value) {
        if(value) {
          var workerID = value;
          vex.dialog.prompt({
            message: 'Please scan your machine ID...',
            placeholder: 'Machine ID',
            callback: function (value) {
              if(value) {
                var machineNo = value;
                var previousMachine = $("#pStart-machine-input").val();
                if(machineNo === previousMachine) {
                  // console.log("same machine, can proceed");
                  vex.dialog.prompt({
                    message: 'Please scan your Finish Quantity...',
                    placeholder: 'Finish Quantity',
                    callback: function (value) {
                      if(value) {
                        var finishQty = value;
                        var psd = $("#pStart-date-input").val();
                        var pStartTime = $("#pStart-time-input").val();
                        var processId = joNo+machineNo+psd+pStartTime;
                        mongo.finishCurrentProcess(joNo, machineNo, finishQty, workerID, processId);
                      } else {
                        new Notification("Operation aborted!");
                        setTimeout(function() {
                          cWindow.reload();
                        });
                      }
                    }
                  })
                } else {
                  vex.dialog.alert("Machine ID is not same with the opened machine ID. Opeartion aborted...")
                  setTimeout(function() {
                    cWindow.reload();
                  },2000);
                }
              } else {
                new Notification("Operation aborted!");
                setTimeout(function() {
                  cWindow.reload();
                });
              }
            }
          });
        } else {
          new Notification("Operation aborted!");
          setTimeout(function() {
            cWindow.reload();
          });
        }
      }
    })
}
