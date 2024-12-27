const mongoose = require('mongoose');
// var { nanoid } = require("nanoid");
var { customAlphabet } = require('nanoid');
const nanoid = customAlphabet('1234567890', 10);
// model.id = nanoid() //=> "4f90d13a42"

const orderSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => nanoid(),
  },

  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },

  orderTotal: {
    type: Number,
    required: true,
  },

  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
    default: 'Pending',
  },

  deliveryType: {
    type: String,
    required: true,
  },

  deliveryTime: {
    type: Date,
    default: Date.now,
  },

  phoneNumber: {
    type: String,
    required: true,
  },

  requestedItems: [
    {
      menuCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'menucategory',
      },
      name: { type: String },
      price: { type: Number },
      quantity: { type: Number },
    },
  ],

  requesterLocation: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  cancellationTime: {
    type: Date,
  },

  paymentStatus: {
    type: Boolean,
    default: false,
  },
});

orderSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.orderId = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Orders', orderSchema);
