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
  // var table = $('#example').DataTable( {
  //       scrollX:        true,
  //       // scrollCollapse: true,
  //       scroller:       true
  //   });
  Ppcs.find({}, function(err, foundOp) {

    foundOp.forEach(function(f) {
      //f.custCode
      //b.machine, b.processName

      f.process.forEach(function(p) {
        var a = JSON.stringify(p);
        var b = JSON.parse(a);
        table.row.add([
          f._id,
          b.processName,
          b.machine,
          b.processStatus,
          b.startDate,
          b.startTime,
          b.startWorker,
          b.finishDate,
          b.finishTime,
          b.finishWorker,
          b.processQty,


          f.custCODE,
          f.delDate,
          f.drawingNo,
          f.location,
          f.materialReceived,
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
      })
    })
  });

  mongoose.connection.close();

  //DATATABLES SEARCH FUNCTIONS START
  $('#example tfoot th').each( function () {
      var title = $(this).text();
      $(this).html( '<input type="text" placeholder="Search '+title+'" />' );
  });

  // Apply the search
  // table.columns().every( function () {
  //     var that = this;
  //
  //     $( 'input', this.footer() ).on( 'keyup change clear', function () {
  //         if ( that.search() !== this.value ) {
  //             that
  //                 .search( this.value )
  //                 .draw();
  //         }
  //     });
  // });
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

    //DATATABLES SEARCH FUNCTIONS END

// });

// $(window).on('load', function () {
//
//   //FOURTH ATTEMPT DATATABLES FUNCTIONS
//
//   //Connection to Mongodb
//   // const mongoose = require("mongoose");
//   mongoose.connect(mongoURI, options);
//
//   Ppcs.find({}, function(err, foundOP) {
//     // var i = JSON.stringify(foundOP);
//     foundOP.forEach(function(o) {
//       // JSON.stringify(o);
//       // console.log(o);
//       // console.log(o.process.length);
//       o.process.forEach(function(r) {
//       var aa =  JSON.stringify(r);
//       var bb = JSON.parse(aa);
//         // console.log(bb._id)
//         });
//       })
//     })
//   mongoose.connection.close();
//
// });
// mongoose.connection.close();

$("#switchProcess-btn").on("click", function() {
  main.createSwitchProcessWindow();
  cWindow.close();
})

$("#refresh-btn").on("click", function() {
  cWindow.reload();
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
