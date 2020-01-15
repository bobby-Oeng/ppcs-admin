const remote = require('electron').remote;
const main = remote.require('./main.js')
const ipc = require('electron').ipcRenderer;
const cWindow = remote.getCurrentWindow();
const time = require("./js/formatTime.js");
const Ppcs = require("./js/schema");
const mongoose = require("mongoose");
// const mongoURI = "mongodb://root:adminpwd@localhost:27017/tptwDB?authSource=admin";
const mongoURI = "mongodb://localhost:27017/tptwDB";
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

$("#process-enter").on("click", function() {
  main.createProcessListWindow();
  cWindow.close();
})

$("#userMachine-enter").on("click", function() {
  main.createUserMachineWindow();
  cWindow.close();
})


$(document).ready(function() {
  mongoose.connect(mongoURI, options);
  Ppcs.find({ status: "WIP"}, function(err, foundTitle) {
    var due = 0;
    var dueName = [];
    var overDue = 0;
    var overDueName = [];
    if(err) {
      console.log(err);
    } else {
      mongoose.connection.close();

      foundTitle.forEach(function(title) {

        var sqldate = title.delDate;
        var datearray = sqldate.split("/");

        var dd = datearray[1] + '/' + datearray[0] + '/' + datearray[2];

        // var dd = title.delDate;
        // var date = title.created;
        const date1 = new Date(dd);
        console.log(date1);
        // const date2 = new Date(date);
        const date2 = new Date();
        // const diffTime = Math.abs(date2-date1);
        // const diffTime = Math.abs(date1-date2);
        const diffTime = date1-date2;
        console.log(diffTime);
        // const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
        // console.log("diffDays: " + diffDays);
        if( diffDays <= 10 && diffDays >= 0 ) {
        due = due + 1;
        dueName.push("( " + title._id + "- remains: " + diffDays + " days )");
      } else if (diffDays < 0){
        overDue = overDue + 1;
        overDueName.push(" ( " + title._id + "- overdue: " + diffDays + " days )");
      }
      })
      $("#overDue-span").text(overDue);
      $("#almost-due-span").text(due);
      $(function () {
        $("#overDue-btn").attr("title", overDueName);
        $("#btn-tooltip").attr("title", dueName);
        $('[data-toggle="tooltip"]').tooltip();
      })
    }
  })
})


$("#nearDue-btn").on("click", function() {
  main.createNearDueWindow();
  cWindow.close();
});


$("#overDue-btn").on("click", function() {
  main.createOverDueWindow();
  cWindow.close();
});
