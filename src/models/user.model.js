const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const model = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
    role: { type: String, default: 'user' },
    isActive: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    emailOTP: { type: String },
    emailVerified: { type: Boolean, default: false },
  },
  { autoCreate: true }
);

module.exports = mongoose.model('users', model);
