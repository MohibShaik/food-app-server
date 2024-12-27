const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const model = new Schema({
  menuCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'menucategory',
  },
  name: { type: String },
  description: { type: String },
  price: { type: Number },
  quantity: { type: Number },
  images: { type: String },
});

module.exports = mongoose.model('menu-items', model);
