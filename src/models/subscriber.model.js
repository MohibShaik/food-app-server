const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const model = new Schema({
  email: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('subscriber', model);
