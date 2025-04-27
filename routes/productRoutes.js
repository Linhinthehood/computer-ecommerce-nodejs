const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Main routes
router.get("/", productController.getAllProducts);
router.get("/product/:id", productController.getProductByID);
router.get("/search", productController.searchProducts);

// Cart routes
router.post('/cart/add', productController.addToCart);
router.delete('/cart/remove/:id', productController.removeFromCart);
router.delete('/cart/clear', productController.clearCart);
router.get('/cart', productController.getCart);
router.get('/checkout', productController.getCheckout);

// Category routes - Move this to the end
router.get("/:category(laptop|ram|cpu|ssd|hdd)", productController.getProductsByCategory);

module.exports = router;