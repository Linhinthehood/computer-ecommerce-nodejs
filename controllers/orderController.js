// controllers/orderController.js
const Receipt = require('../models/receiptModel');
const messageService = require('../services/messageService');
const { QUEUES } = require('../config/rabbitmq');

exports.placeOrder = async (req, res) => {
  try {
    // Lấy dữ liệu từ body (truyền lên từ phía client)
    const {
      email,
      fullName,
      phone,
      address,
      district,
      city,
      shippingMethod,
      paymentMethod,
      cartItems,
      totalPrice
    } = req.body;

    // Tạo document Receipt
    const newReceipt = new Receipt({
      email,
      fullName,
      phone,
      address,
      district,
      city,
      shippingMethod,
      paymentMethod,
      cartItems,
      totalPrice
    });

    // Save order to database
    await newReceipt.save();

    // Publish message to order notification queue
    await messageService.publishMessage(QUEUES.ORDER_NOTIFICATION, {
      email,
      fullName,
      phone,
      cartItems,
      totalPrice,
      orderId: newReceipt._id
    });

    // Sau khi lưu thành công, có thể trả về JSON, hoặc redirect
    return res.json({ success: true, message: 'Order placed successfully!' });
  } catch (error) {
    console.error('Error placing order:', error);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};
