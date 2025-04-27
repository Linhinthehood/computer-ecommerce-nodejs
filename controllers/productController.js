const Product = require("../models/productModel");

exports.getAllProducts = async (req, res) => {
  try {
    console.log("Attempting to fetch products...");

    let filter = {};
    let sortOption = {};
    let products;

    // Lọc theo loại sản phẩm (nếu có)
    if (req.query.type) {
      filter.type = req.query.type;
    }

    // Sort by first variant's price
    if (req.query.sort) {
      if (req.query.sort === "asc") {
        // Sort by the first variant's price in ascending order
        products = await Product.aggregate([
          {
            $addFields: {
              firstVariantPrice: { $arrayElemAt: ["$variants.price", 0] }
            }
          },
          { $sort: { firstVariantPrice: 1 } }
        ]);
      } else if (req.query.sort === "desc") {
        // Sort by the first variant's price in descending order
        products = await Product.aggregate([
          {
            $addFields: {
              firstVariantPrice: { $arrayElemAt: ["$variants.price", 0] }
            }
          },
          { $sort: { firstVariantPrice: -1 } }
        ]);
      }
    } else {
      // No sorting, just fetch products
      products = await Product.find(filter);
    }

    console.log("Products fetched:", products.length);

    res.render("index", { products, user: req.session.user });
  } catch (error) {
    console.error("Error in getAllProducts:", error);
    res.status(500).json({ message: "Server error", error: error.toString() });
  }
};


exports.getProductByID = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    if (!Array.isArray(product.images)) {
      product.images = [product.images]; // Convert single image to array
    }
    res.render("detail", { product, user: req.session.user });
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).send("Server error");
  }
};


exports.searchProducts = async (req, res) => {
  try {
    const searchQuery = req.query.query;

    if (!searchQuery) {
      return res.redirect("/");
    }

    console.log("Searching for products matching:", searchQuery);

    const products = await Product.find({
      name: { $regex: searchQuery, $options: "i" }
    });

    console.log("Products found:", products.length);

    if (products.length === 0) {
      return res.redirect("/"); // Nếu không tìm thấy sản phẩm, quay về trang index
    }

    res.render("index", { products, isSearch: true, user: req.session.user });
  } catch (error) {
    console.error("Error in searchProducts:", error);
    res.status(500).json({ message: "Server error", error: error.toString() });
  }
};





exports.getLaptops = async (req, res) => {
  try {
    console.log("Fetching only laptops...");

    let sortOption = {};
    if (req.query.sort === "asc") {
      sortOption = { "variants.0.price": 1 }; // Sort by first variant's price ascending
    } else if (req.query.sort === "desc") {
      sortOption = { "variants.0.price": -1 }; // Sort by first variant's price descending
    }

    const products = await Product.find({ category: "LAPTOP" }).sort(sortOption);

    console.log("Laptops found:", products.length);

    if (products.length === 0) {
      console.log("No laptops found in database");
    }

    res.render("laptop", { products, user: req.session.user });
  } catch (error) {
    console.error("Error in getLaptops:", error);
    res.status(500).json({ message: "Server error", error: error.toString() });
  }
};

exports.getRAMs = async (req, res) => {
  try {
    console.log("Fetching only RAMs...");

    let sortOption = {};
    if (req.query.sort === "asc") {
      sortOption = { "variants.0.price": 1 }; // Sort by first variant's price ascending
    } else if (req.query.sort === "desc") {
      sortOption = { "variants.0.price": -1 }; // Sort by first variant's price descending
    }

    const products = await Product.find({ category: "RAM" }).sort(sortOption);

    console.log("RAMs found:", products.length);

    if (products.length === 0) {
      console.log("No RAMs found in database");
    }

    res.render("ram", { products, user: req.session.user });
  } catch (error) {
    console.error("Error in getRAMs:", error);
    res.status(500).json({ message: "Server error", error: error.toString() });
  }
};

exports.getCPUs = async (req, res) => {
  try {
    console.log("Fetching only CPUs...");

    let sortOption = {};
    if (req.query.sort === "asc") {
      sortOption = { "variants.0.price": 1 }; // Sort by first variant's price ascending
    } else if (req.query.sort === "desc") {
      sortOption = { "variants.0.price": -1 }; // Sort by first variant's price descending
    }

    const products = await Product.find({ category: "CPU" }).sort(sortOption);

    console.log("CPUs found:", products.length);

    if (products.length === 0) {
      console.log("No CPUs found in database");
    }

    res.render("cpu", { products, user: req.session.user });
  } catch (error) {
    console.error("Error in getCPUs:", error);
    res.status(500).json({ message: "Server error", error: error.toString() });
  }
};

exports.getSSDs = async (req, res) => {
  try {
    console.log("Fetching only SSDs...");

    let sortOption = {};
    if (req.query.sort === "asc") {
      sortOption = { "variants.0.price": 1 }; // Sort by first variant's price ascending
    } else if (req.query.sort === "desc") {
      sortOption = { "variants.0.price": -1 }; // Sort by first variant's price descending
    }

    const products = await Product.find({ category: "SSD" }).sort(sortOption);

    console.log("SSDs found:", products.length);

    if (products.length === 0) {
      console.log("No SSDs found in database");
    }

    res.render("ssd", { products, user: req.session.user });
  } catch (error) {
    console.error("Error in getSSDs:", error);
    res.status(500).json({ message: "Server error", error: error.toString() });
  }
};

exports.getHDDs = async (req, res) => {
  try {
    console.log("Fetching only HDDs...");

    let sortOption = {};
    if (req.query.sort === "asc") {
      sortOption = { "variants.0.price": 1 }; // Sort by first variant's price ascending
    } else if (req.query.sort === "desc") {
      sortOption = { "variants.0.price": -1 }; // Sort by first variant's price descending
    }

    const products = await Product.find({ category: "HDD" }).sort(sortOption);

    console.log("HDDs found:", products.length);

    if (products.length === 0) {
      console.log("No HDDs found in database");
    }

    res.render("hdd", { products, user: req.session.user });
  } catch (error) {
    console.error("Error in getHDDs:", error);
    res.status(500).json({ message: "Server error", error: error.toString() });
  }
};

// controllers/cartController.js

// Hàm thêm sản phẩm vào cart (lưu vào req.session.cart)
exports.addToCart = (req, res) => {
  const { id, name, price, quantity, size, image } = req.body;
  if (!req.session.cart) {
    req.session.cart = [];
  }
  // Tìm xem sản phẩm đã có trong cart chưa (dựa vào id và size)
  const index = req.session.cart.findIndex(item => item.id === id && item.size === size);
  if (index > -1) {
    req.session.cart[index].quantity += quantity;
  } else {
    req.session.cart.push({ id, name, price, quantity, size, image });
  }
  console.log("Cart after adding:", req.session.cart);
  return res.json(req.session.cart);
};

// Hàm xóa sản phẩm khỏi cart
exports.removeFromCart = (req, res) => {
  const { id } = req.params;
  const size = req.query.size;
  if (req.session.cart) {
    req.session.cart = req.session.cart.filter(item => !(item.id === id && item.size === size));
  }
  return res.json(req.session.cart || []);
};

// Hàm xóa toàn bộ cart
exports.clearCart = (req, res) => {
  req.session.cart = [];
  return res.json(req.session.cart);
};

// Hàm lấy cart (cho cả trang cart và checkout)
exports.getCart = (req, res) => {
  const cart = req.session.cart || [];
  res.render('cart', { cart, user: req.session.user });
};

exports.getCheckout = (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth');
  }
  const cart = req.session.cart || [];
  res.render('checkout', { cart, user: req.session.user });
};