const mongoose = require('mongoose');

const   productSchema = new mongoose.Schema({
    title: {
      type: String,
      text:true
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
    },
    quantity: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('products', productSchema);