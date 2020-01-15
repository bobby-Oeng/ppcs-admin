
exports.joProcessFlow = (joNo) => {
  var pool = Firebird.pool(5, fOptions);
  pool.get(function(err, db) {
      if(err) {
        vex.dialog.alert("ERROR WHILE CONNNECTING TO SQL ACCOUNTING!!");
        setTimeout(function() {
        cWindow.reload();
        }, 2000);
      } else {
          if(db) {
            console.log("0");
            db.on('attach', function() {
              console.log("Firebird is now attached in 1");
            });

            db.on('detach', function(isPoolConnection) {
              console.log("Firebird is now disconnected");
            });

            db.on('error', function(err) {
              vex.dialog.alert("db ERROR WHILE CONNNECTING TO SQL ACCOUNTING!!");
              setTimeout(function() {
                cWindow.reload();
              }, 2000);
            })

            var sql2 = 'SELECT * FROM PD_JO WHERE DOCNO=' + Firebird.escape(joNo);
            db.query(sql2, function(err, result) {
              db.detach();
              if(err) {
                new Notification(err);
              } else {
                result.forEach(function(f) {
                  process = [f.UDF_P1, f.UDF_P2, f.UDF_P3, f.UDF_P4, f.UDF_P5, f.UDF_P6, f.UDF_P7, f.UDF_P8, f.UDF_P9, f.UDF_P10];
                  for(var i = 0; i < 10; i++) {
                    $("#sql-connect").append($("<a></a>").val(process[i]).html("P" +[i+1] + ": " + process[i]));
                    $("a").addClass("dropdown-item");
                  };//FOR LOOP
                })
              }
            })
        } else {
          db.detach();
          vex.dialog.alert("No such JO number is SQL Accounting!!");
          setTimeout(function() {
            cWindow.reload();
          }, 2000);
        }
      }
    });
    pool.destroy();
}


exports.materialStatus = (joNo) => {
  Firebird.attach(fOptions, function(err, db) {
          db.on('attach', function() {
            console.log("Firebird is now attached in 1");
          });

          db.on('result', function(result) {
            if(result) {
              console.log("resultx");
            } else {
              console.log("No result");
            }
          });

          db.on('detach', function(isPoolConnection) {
            console.log("Firebird is now disconnected");
          });

          db.on('error', function(err) {
          vex.dialog.alert("ERROR WHILE CONNNECTING TO SQL ACCOUNTING!!");
          })
      if(err) {
        throw err;
      } else {
          if(db) {
            var sql2 = 'SELECT * FROM PD_JO WHERE DOCNO=' + Firebird.escape(joNo);
            db.query(sql2, function(err, result) {
              db.detach();
              if(err) {
                new Notification(err);
              } else {
                  if(result.length > 0) {
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
                      fcustCode = f.CODE;
                      fdeldate = f.DELIVERYDATE;
                      fdrawingNo = f.ITEMCODE;
                      // fitemCode = f.ITEMCODE;
                      // fitemDesc = f.DESCRIPTION;
                      flocation = f.LOCATION;
                      fqty = f.QTY;
                      fuom = f.UOM;
                      // fProcessName = foundMachine.name;
                    });//RESULT.FOR EACH
                    if(mReceived === "T") {
                      dialog.createFirstProcess(joNo);
                    } else{
                      vex.dialog.alert("Material not yet received! Operation aborted.!")
                      setTimeout(function() {
                        cWindow.reload();
                      }, 2000);
                    }
                  } else {
                      vex.dialog.alert("No such Job Order in SQL!");
                      setTimeout(function() {
                        cWindow.reload();
                      }, 2000);
                  }
              }
            })
        } else {
          new Notification("ERROR WHILE CONNNECTING TO SQL ACCOUNTING!");
        }
      }
    });
}
