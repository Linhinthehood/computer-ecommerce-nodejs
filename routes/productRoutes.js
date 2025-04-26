const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Route to display all products (Main Page)
router.get("/", productController.getAllProducts);


router.get("/product/:id", productController.getProductByID)

router.get("/shirts", productController.getShirts);

router.get("/bottoms", productController.getBottoms);

router.get("/accessories",productController.getAccessories)

router.get("/outerwears",productController.getOuterwears)


router.get("/search", productController.searchProducts);



// Router for cart & checkout:
router.post('/cart/add', productController.addToCart);
router.delete('/cart/remove/:id', productController.removeFromCart);
router.delete('/cart/clear', productController.clearCart);
router.get('/cart', productController.getCart);
router.get('/checkout', productController.getCheckout);


module.exports = router;