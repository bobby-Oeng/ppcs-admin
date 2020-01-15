const remote = require('electron').remote;
const main = remote.require('./main.js')
const ipc = require('electron').ipcRenderer;
const cWindow = remote.getCurrentWindow();

// async (recommended)
const mongoose = require("mongoose");

// const mongoURI = "mongodb://root:adminpwd@localhost:27017/tptwDB?authSource=admin";
const mongoURI = "mongodb://localhost:27017/tptwDB";
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};


const bcrypt = require('bcryptjs');
const saltRounds = 8;
// const myPlaintextPassword = 's0/\/\P4$$w0rD';
// const someOtherPlaintextPassword = 'not_bacon';
// To hash a password:
// Technique 1 (generate a salt and hash on separate function calls):

// bcrypt.genSalt(saltRounds, function(err, salt) {
//     bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
//         // Store hash in your password DB.
//     });
// });
// Technique 2 (auto-gen a salt and hash):
// bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
//   // Store hash in your password DB.
// });


const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    require: [true, "User ID cannot be blank"]
  },
  password: {
    type: String,
    require: [true, "User password cannot be blank"]
  }
});

const User = mongoose.model("User", userSchema);

//setup before functions
var typingTimer;                //timer identifier
var doneTypingInterval = 1000;  //time in ms, 5 second for example
var input = $('#old-password');
var confirmInput = $("#confirm-password")
// var userInput = $("#old-password").val();

//on keyup, start the countdown
input.on('keyup', function () {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(doneTyping1, doneTypingInterval);
});
//on keydown, clear the countdown
input.on('keydown', function () {
  clearTimeout(typingTimer);
});

//on keyup, start the countdown
confirmInput.on('keyup', function () {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(doneTyping2, doneTypingInterval);
});
//on keydown, clear the countdown
confirmInput.on('keydown', function () {
  clearTimeout(typingTimer);
});

//user is "finished typing," do something
function doneTyping1 () {
  var userInputPassword = $("#old-password").val();
  mongoose.connect(mongoURI, options);
  User.findOne({_id: "admin"}, function(err, foundUser) {
    if(err) {
      mongoose.connection.close();
      new Notification("Error while retrieving user info, please try again later");
    } else {
      mongoose.connection.close();
      console.log(foundUser.password);
      bcrypt.compare(userInputPassword, foundUser.password, function(err, res) {
        if(err) {
          new Notification(err);
        } else {
          if(res === true) {
            $("#cw-img").attr("src", "./assets/correct.png");
            $("#old-password").attr("readonly", "true");
          } else {
            $("#cw-img").attr("src", "./assets/close.png");
          }
        }
        });
    }
  })
}

//user is "finished typing," do something
function doneTyping2 () {
  // var userInputPassword = $("#old-password").val();
  var userConfirm = $("#confirm-password").val();
  var userNew = $("#new-password").val();
  if(userConfirm === userNew) {
    $("#change-password-btn").toggle();
  } else {
    $("#cw-confirm-img").attr("src", "./assets/close.png");
  }
}


$("#change-password-btn").on("click", function() {
  mongoose.connect(mongoURI, options);
  var newPassword = $("#confirm-password").val();
  bcrypt.hash(newPassword, saltRounds, function(err, hash) {
    if(err) {
      new Notification(err);
    } else {
      User.updateOne({_id: "admin"}, {$set: { password: hash}}, function(err) {
        if(err) {
          mongoose.connection.close();
          new Notification(err);
        } else {
          mongoose.connection.close();
          new Notification("Successfully changed!");
          setTimeout(function() {
            cWindow.close();
          }, 2000);
        }
      })
    }
  });
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
