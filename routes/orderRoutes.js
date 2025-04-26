const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// POST /place-order
router.post('/place-order', orderController.placeOrder);

module.exports = router;
