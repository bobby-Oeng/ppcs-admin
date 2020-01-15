const mongoose = require("mongoose");

const ppcsSchema = new mongoose.Schema({
  _id: String, //JoNo
  custCODE: String,
  delDate: String,
  drawingNo: String,
  location: String,
  materialReceived: String,
  totalQty: String,
  qcInsStartDateTime: String,
  qcInsFinishDateTime: String,
  qcApprovedQty: Number,
  qcRejectedQty: Number,
  qcRejectedReason: String,
  qcReworkQty: Number,
  qcReworkReason: String,
  finalQaInsStartDateTime: String,
  finalQaInsFinishDateTime: String,
  finalQaApprovedQty: Number,
  finalQaRejectedQty: Number,
  finalQaRejectedReason: String,
  finalQaReworkQty: Number,
  finalQaReworkReason: String,
  status: {
    type: String,
    required: [true, "Status cannot be blank"]
  },
  process: [{
    _id: String,
    seq: {type: Number, default: 0},
    machine: String,
    processName: String,
    processQty: Number,
    startDate: String,
    startTime: String,
    startWorker: String,
    finishDate: String,
    finishTime: String,
    finishWorker: String,
    processStatus: String
  }]
});

const Ppcs = mongoose.model("Ppcs", ppcsSchema);

module.exports = Ppcs;
