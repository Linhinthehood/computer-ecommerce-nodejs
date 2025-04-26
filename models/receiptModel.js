const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
  email: { type: String, required: true },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  district: { type: String },
  city: { type: String },
  shippingMethod: { type: String, enum: ["standard", "express"], require: true },       // e.g. standard, express...
  paymentMethod: { type: String, enum: ["paymentVNPay", "paymentBank", "paymentCOD"], require: true },        // e.g. VNPay, Bank, COD...
  cartItems: [
    {
      id: String,
      name: String,
      price: Number,
      quantity: Number,
      size: String,
      image: String
    }
  ],
  totalPrice: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Receipt", receiptSchema);
