exports.createFirstProcess = (machineNo, workerID, joNo) => {
  // mongoose.connect(mongoURI, options);
  Machine.findOne({_id: machineNo}, function(err, foundMachine) {
    if(err) {
      vex.dialog.alert(err + "Server is busy, system will auto refresh in 3 seconds.");
      setTimeout(function() {
        cWindow.reload();
      }, 3000)
    } else {
      if(foundMachine) {
        var processName = foundMachine.processName;
        var pStartDate = new Date();
        var pStartTime = time.formatAMPM(new Date());
        var psd = pStartDate.toLocaleDateString();
        var sqlDelDate = fdeldate;
        var sqlDate = sqlDelDate.toLocaleDateString();

              const ppcs = new Ppcs({
                _id: joNo,
                custCODE: fcustCode,
                delDate: sqlDate,
                drawingNo: fdrawingNo,
                location: flocation,
                materialReceived: mReceived,
                totalQty: fqty + " " + fuom,
                status: "WIP",
                qcInsStartDateTime: "",
                qcInsFinishDateTime: "",
                qcApprovedQty: "",
                qcRejectedQty: "",
                qcRejectedReason: "",
                qcReworkQty: "",
                qcReworkReason: "",
                finalQaInsStartDateTime: "",
                finalQaInsFinishDateTime: "",
                finalQaApprovedQty: "",
                finalQaRejectedQty: "",
                finalQaRejectedReason: "",
                finalQaReworkQty: "",
                finalQaReworkReason: "",
                process: [{
                  _id: joNo+machineNo+psd+pStartTime,
                  machine: machineNo,
                  processName: processName,
                  startDate: psd,
                  startTime: pStartTime,
                  startWorker: workerID,
                  processStatus: "OPEN",
                  finishDate: "",
                  finishTime: "",
                  finishWorker: "",
                  processQty: ""
                }]
              });
              ppcs.save(function(err) {
                if(err) {
                  mongoose.connection.close();
                  vex.dialog.alert(err);
                  console.log(err);
                } else {
                  // START BODY
                  mongoose.connection.close();
                  new Notification("Process has been started successfully!");
                  $(".start-body").toggle();
                  $("#pName-input").val(processName);
                  $("#pStart-date-input").val(psd);
                  $("#pStart-time-input").val(pStartTime);
                  $("#pStart-person-input").val(workerID);
                  $("#pStart-machine-input").val(machineNo);
                  //START BODY END
                  $(".sql-body").toggle();

                  $("#joNo-input").val(joNo);
                  $("#custCode-input").val(fcustCode);
                  $("#delDate-input").val(fdeldate);
                  $("#drawNo").val(fdrawingNo);
                  $("#totalQty").val(fqty + " " + fuom);
                  $("#location").val(flocation);
                  $("#mReceived").prop("checked", true);
                  $("#joInput").hide();
                  $("#finishInput").toggle();
                  $("#finishInput").focus();
                }//else
              })//New PPCS
      } else {
        mongoose.connection.close();
        new Notification("No machine found");
      }
    }
  });
}

//If found Jo and machine is closed, performe line below
exports.pushNewProcess = (machineNo, workerID, joNo) => {
  Machine.findOne({_id: machineNo}, function(err, foundMachine) {
    if(err) {
      new Notification(err);
    } else {
      if(foundMachine) {
        var processName = foundMachine.processName;
        var pStartDate = new Date();
        var pStartTime = time.formatAMPM(new Date());
        var psd = pStartDate.toLocaleDateString();
        Ppcs.updateMany({"_id": joNo}, {$push: {
          process: [{
            _id: joNo+machineNo+psd+pStartTime,
            machine: machineNo,
            processName: processName,
            processQty: "",
            startDate: psd,
            startTime: pStartTime,
            startWorker: workerID,
            finishDate: "",
            finishTime: "",
            finishWorker: "",
            processStatus: "OPEN"
            }]
          }}, function(err) {
            if(err) {
              vex.dialog.alert(err);
            } else {
              new Notification("Process has been started successfully!");
              //START SQL BODY
              $(".start-body").toggle();
              $("#pName-input").val(processName);
              $("#pStart-date-input").val(psd);
              $("#pStart-time-input").val(pStartTime);
              $("#pStart-person-input").val(workerID);
              $("#pStart-machine-input").val(machineNo);
              $("#finishInput").toggle();
              $("#finishInput").focus();
              //START BODY END
              findAndToggleSqlBody(joNo);
            }
          });
      } else {
        mongoose.connection.close();
        vex.dialog.alert("No such machine in system. System will auto refresh in 5 seconds");
        setTimeout(function() {
          cWindow.reload();
        }, 5000);
      }
    }
  })
}


exports.openCurrentProcess = (joNo, machineNo) => {
  mongoose.connect(mongoURI, options);
  Ppcs.findOne({"_id": joNo, "process.machine": machineNo})
}
//
// exports.openAllBody = (f, joNo) => {
//   //START SQL BODY
//   $(".start-body").toggle();
//   $("#pName-input").val(f.processName);
//   $("#pStart-date-input").val(f.startDate);
//   $("#pStart-time-input").val(f.startTime);
//   $("#pStart-person-input").val(f.startWorker);
//   $("#pStart-machine-input").val(f.machine);
//   $("#finishInput").toggle();
//   $("#finishInput").focus();
//   //START BODY END
//   findAndToggleSqlBody(joNo);
//   //close body toggle;
//   $(".finish-body").toggle();
//   $("#pFinish-date-input").val(f.finishDate);
//   $("#pFinish-time-input").val(f.finishTime);
//   $("#pFinish-person-input").val(f.finishWorker);
//   $("#pFinish-qty-input").val(f.processQty);
//   // $("#finishInput").toggle();
// }

function findAndToggleSqlBody(joNo) {
  Ppcs.findOne({"_id": joNo}, function(err, foundJo) {
    if(err) {
      new Notification(err);
      vex.dialog.alert("Some issues happened when connecting to database, window will refresh after 5 seconds....");
      setTimeout(function() {
        cWindow.reload();
      }, 5000);
    } else {
      mongoose.connection.close();
      //START PROCESS BODY
      $(".sql-body").toggle();
      $("#joNo-input").val(foundJo._id);
      $("#custCode-input").val(foundJo.custCODE);
      $("#delDate-input").val(foundJo.delDate);
      $("#drawNo").val(foundJo.drawingNo);
      $("#totalQty").val(foundJo.totalQty);
      $("#location").val(foundJo.location);
      $("#mReceived").prop("checked", true);
      $("#joInput").hide();
      $("#finishInput").toggle();
      $("#finishInput").focus();
    }
  })
}

// console.log(joNo);
// console.log(machineNo);
// console.log(workerID);
// console.log(finishQty);
exports.finishCurrentProcess = (joNo, machineNo, finishQty, workerID, processId) => {
  mongoose.connect(mongoURI, options);
  // var processName = foundMachine.processName;
  var pFinishDate = new Date();
  var pFinishTime = time.formatAMPM(new Date());
  var pfd = pFinishDate.toLocaleDateString();

  Ppcs.updateMany({"process._id": processId }, {"$set": {
      "process.$.processQty": finishQty,
      "process.$.finishDate": pfd,
      "process.$.finishTime": pFinishTime,
      "process.$.finishWorker": workerID,
      "process.$.processStatus": "CLOSED"
    }}, function(err) {
      if(err) {
        mongoose.connection.close();
        vex.dialog.alert(err);
      } else {
        mongoose.connection.close();
        vex.dialog.alert("Process has been closed successfully!");
        //close body toggle;
        $(".finish-body").toggle();
        $("#pFinish-date-input").val(pfd);
        $("#pFinish-time-input").val(pFinishTime);
        $("#pFinish-person-input").val(workerID);
        $("#pFinish-qty-input").val(finishQty);
        $("#finishInput").toggle();
      }
    });
}


exports.toggeleSqlBody = (joNo) => {
  Ppcs.findOne({"_id": joNo}, function(err, foundPpcs) {
    if(err) {
      vex.dialog.alert("Error while retrieve data from database, system will auto refresh in 5 seconds");
      setTimeout(function() {
        cWindow.reload();
      }, 5000);
    } else {
      if(foundPpcs) {
        mongoose.connection.close();
        $(".sql-body").toggle();
        $("#joNo-input").val(joNo);
        $("#custCode-input").val(foundPpcs.custCODE);
        $("#delDate-input").val(foundPpcs.delDate);
        $("#drawNo").val(foundPpcs.drawingNo);
        $("#totalQty").val(foundPpcs.totalQty);
        $("#location").val(foundPpcs.location);
        $("#mReceived").prop("checked", true);
        $("#joInput").hide();
      }
    }
  })
}
