const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const orderSchema = new mongoose.Schema(
  {
    product: {
      type: ObjectId,
      ref: "product",
    },
    count: Number,
    price: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("orders", orderSchema);
