const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const model = new Schema({
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  place: { type: String, required: true },
  specials: { type: String },
});

module.exports = mongoose.model('Schedule', model);
