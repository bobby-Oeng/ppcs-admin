const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: [true, "id cannot be blank"]
  },
  name: {
    type: String,
    required: [true, "name cannot be blank"]
  }
})

const Worker = mongoose.model("Worker", workerSchema);
module.exports = Worker;
