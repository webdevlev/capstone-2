const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First Name is required"],
  },
  lastName: {
    type: String,
    required: [true, "Last Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  mobileNo: {
    type: String,
    required: [true, "Mobile Number is required"],
  },
  totalPrice: {
    type: Number,
  },
  userOrders: [
    {
      productId: {
        type: String,
        required: [true, "Product ID is required"],
      },
      productName: {
        type: String,
        required: [true, "Product Name is required"],
      },
      quantity: {
        type: Number,
        required: [true, "Product Quantity is required"],
      },

      totalAmount: {
        type: Number,
        required: [true, "Total Amount is required"],
      },
      purchasedOn: {
        type: String,
        default: new Date(),
      },
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
