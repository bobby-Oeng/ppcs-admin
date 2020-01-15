const remote = require('electron').remote;
const main = remote.require('./main.js');
const cWindow = remote.getCurrentWindow();
const ipc = require('electron').ipcRenderer;
const Ppcs = require("./js/schema");
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
  //Without line below Datatable tfoot seach will failed if scrollX: true;
  $('#example tfoot th').each( function () {
        var title = $('#example thead th').eq( $(this).index() ).text();
        $(this).html( '<input type="text" placeholder="Search '+title+'" />' );
    } );

  var table = $('#example').DataTable({
  scrollX: true,
  // colReorder: true,
  // paging: false,
  dom: 'Bfrtip',
  buttons: [{
                extend: 'pdfHtml5',
                orientation: 'landscape',
                pageSize: 'A1',
                className: 'btn-pdf'
            },
            {
                extend: 'excelHtml5',
                className: 'btn-excel'
                      },
      'copy', 'print'
  ],
});

  mongoose.connect(mongoURI, options);

  Ppcs.find({status: "WIP"}, function(err, foundOp) {
    if(err) {
      new Notification(err);
    } else {
      foundOp.forEach(function(f) {
        console.log(f.custCODE);
        console.log(f.delDate);
        var sqldate = f.delDate;
        var datearray = sqldate.split("/");
        var dd = datearray[1] + '/' + datearray[0] + '/' + datearray[2];
        const date1 = new Date(dd);
        const date2 = new Date();
        const diffTime = date1 - date2;
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        if(diffDays < 0) {
          table.row.add([
            f._id,
            f.custCODE,
            f.delDate,
            f.drawingNo,
            f.location,
            diffDays + " Days",
            f.totalQty,
            f.status,
            f.qcInsStartDateTime,
            f.qcInsFinishDateTime,
            f.qcApprovedQty,
            f.qcRejectedQty,
            f.qcReworkQty,
            f.qcRejectedReason,
            f.qcReworkReason,
            f.finalQaInsStartDateTime,
            f.finalQaInsFinishDateTime,
            f.finalQaApprovedQty,
            f.finalQaRejectedQty,
            f.finalQaReworkQty,
            f.finalQaRejectedReason,
            f.finalQaReworkReason,
            ]).draw();
        }
      })
    }
  });
  mongoose.connection.close();
  //DATATABLES SEARCH FUNCTIONS START
  $('#example tfoot th').each( function () {
      var title = $(this).text();
      $(this).html( '<input type="text" placeholder="Search '+title+'" />' );
  });

  $( table.table().container() ).on( 'keyup change', 'tfoot input', function () {
   table
        .column( $(this).parent().index()+':visible' )
        .search( this.value )
        .draw();
});

//change button css WHERE
var z = $("div.dt-buttons").find(".btn-excel");
    z.css("color", "green");
    z.css("border-color", "green");
    // z.css("background-color", "green");
    z.text("Export to Excel");


var p = $("div.dt-buttons").find(".btn-pdf");
    p.css("color", "red");
    p.css("border-color", "red");
    p.text("Export to PDF");
});

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
