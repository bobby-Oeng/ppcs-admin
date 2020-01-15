const remote = require('electron').remote;
const main = remote.require('./main.js');
const cWindow = remote.getCurrentWindow();
const ipc = require('electron').ipcRenderer;
const Worker = require("./js/workerSchema");
var vex = require('vex-js');
vex.registerPlugin(require('vex-dialog'));
vex.defaultOptions.className = 'vex-theme-default';
const mongoose = require("mongoose");
// const mongoURI = "mongodb://root:adminpwd@localhost:27017/tptwDB?authSource=admin";
const mongoURI = "mongodb://localhost:27017/tptwDB";
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

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

mongoose.connect(mongoURI, options);

$(document).ready( function () {
  mongoose.connect(mongoURI, options);
  Worker.find({}, function(err, foundW) {
    if(err) {
      new Notification(err);
    } else {
      foundW.forEach(function(w) {
        $('#example').DataTable().row.add([
                w._id,
                w.name,
                // "<input class="btn btn-sm btn-success btn-view-info" id="location-id-button" type="button" value="View info"/>"
                '<input class="btn btn-sm btn-outline-success btn-delete-worker" id="user-id-button" type="button" value="Delete Worker"/>'
              ]).draw();
              $("#user-id-button").attr("id", w._id);
      })
      // foundOp.forEach(function(f) {
      //   f.process.forEach(function(p) {
      //     var a = JSON.stringify(p);
      //     var b = JSON.parse(a);
      //     $('#example').DataTable().row.add([
      //         b.name,
      //         b._id,
      //         // "<input class="btn btn-sm btn-success btn-view-info" id="location-id-button" type="button" value="View info"/>"
      //         '<input class="btn btn-sm btn-outline-success btn-view-info" id="user-id-button" type="button" value="Edit info"/>'
      //       ]).draw();
      //       $("#user-id-button").attr("id", b._id);
      //   })
      // })
    }
  });

  mongoose.connection.close();

    //DATATABLES SEARCH FUNCTIONS START
  $('#example tfoot th').each( function () {
      var title = $(this).text();
      $(this).html( '<input type="text" placeholder="Search '+title+'" />' );
  });

  // DataTable
  var table = $('#example').DataTable();

  // Apply the search
  table.columns().every( function () {
      var that = this;

      $( 'input', this.footer() ).on( 'keyup change clear', function () {
          if ( that.search() !== this.value ) {
              that
                  .search( this.value )
                  .draw();
          }
      });
  });

});

$("#titleTable").on("click","input", function() {
  // new Notification(this.id);//change to deleteOne
  // A.findOneAndDelete(conditions, callback)
  var deleteId = this.id;
  vex.dialog.confirm({
    message: 'Are you absolutely sure you want to delete this worker?',
    callback: function (value) {
        if (value) {
            mongoose.connect(mongoURI, options);
            Worker.findOneAndDelete({_id: deleteId}, function(err) {
              if (err) {
                vex.dialog.alert(err);
                mongoose.connection.close();
              } else {
                mongoose.connection.close();
                new Notification('Successfully deleted the worker.');
                setTimeout(function(){
                  cWindow.reload();
                }, 500);
              }
            });
        } else {
            new Notification('Operation aborted');
        }
    }
})
})

$("#addUser-btn").on("click", function() {
  main.addUserSettingWindow();
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
