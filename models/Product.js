const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product Name is required"],
  },
  description: {
    type: String,
    required: [true, "Product Description is required"],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
  },
  createdOn: {
    type: Date,
    default: new Date(),
  },
  inOrders: [
    {
      userId: {
        type: String,
        required: [true, "User ID is required"],
      },
      orderId: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model("Product", productSchema);
