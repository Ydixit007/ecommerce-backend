import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    shippingInfo: {
      address: {
        type: String,
        required: [true, "Please enter an address"],
      },
      city: {
        type: String,
        required: [true, "Please enter a city"],
      },
      state: {
        type: String,
        required: [true, "Please enter a state"],
      },
      country: {
        type: String,
        required: [true, "Please enter a country"],
      },
      pincode: {
        type: Number,
        required: [true, "Please enter a pincode"],
      },
    },
    user: {
      type: String,
      ref: "User",
      required: true,
    },
    subTotal: {
      type: Number,
      required: [true, "invalid subtotal"],
    },
    tax: {
      type: Number,
      required: [true, "invalid tax"],
    },
    shippingCharges: {
      type: Number,
      required: [true, "invalid shipping charges"],
    },
    discount: {
      type: Number,
    },
    total: {
      type: Number,
      required: [true, "invalid total price"],
    },
    status: {
      type: String,
      enum: ["Received", "Processing", "Shipped", "In-transit", "Delivered"],
      default: "Received",
    },
    trackingLink: {
      type: String,
    },
    orderItems: [
      {
        productName: String,
        productImage: String,
        price: Number,
        quantity: Number,
        size: String,
        discount: Number,
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model("Order", schema);
