const mongoose = require("mongoose");

const machineSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: [true, "id cannot be blank"]
  },
  name: {
    type: String,
    required: [true, "name cannot be blank"]
  },
  processName: {
    type: String,
    required: [true, "Process name cannot be blank"]
  },
  status: {
    type: String,
    required: [true, "status cannot be blank"]
  },
})

const Machine = mongoose.model("Machine", machineSchema);
module.exports = Machine;
