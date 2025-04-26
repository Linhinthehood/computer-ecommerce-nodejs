const Product = require("../models/productModel");

exports.getAllProducts = async (req, res) => {
  try {
    // Check if user is logged in
    // if(!req.session.user) {
    //   res.redirect('/auth');
    // }

    console.log("Attempting to fetch products...");

    let filter = {};
    let sortOption = {};

    // Lọc theo loại sản phẩm (nếu có)
    if (req.query.type) {
      filter.type = req.query.type;
      console.log("Filtering products by type:", req.query.type);
    }

    // Sắp xếp theo giá (nếu có)
    if (req.query.sort === "asc") {
      sortOption.price = 1; // Sắp xếp giá tăng dần
    } else if (req.query.sort === "desc") {
      sortOption.price = -1; // Sắp xếp giá giảm dần
    }

    // Truy vấn sản phẩm với filter và sort
    const products = await Product.find(filter).sort(sortOption);

    console.log("Products fetched:", products.length);

    if (products.length === 0) {
      console.log("No products found in database");
    }

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

exports.getShirts = async (req, res) => {
  try {
    console.log("Fetching only shirts...");

    let sortOption = {};
    if (req.query.sort === "asc") {
      sortOption.price = 1;
    } else if (req.query.sort === "desc") {
      sortOption.price = -1;
    }

    const products = await Product.find({ type: "Shirts" }).sort(sortOption);

    console.log("Shirts found:", products.length);

    if (products.length === 0) {
      console.log("No shirts found in database");
    }

    res.render("shirts", { products, user: req.session.user });
  } catch (error) {
    console.error("Error in getShirts:", error);
    res.status(500).json({ message: "Server error", error: error.toString() });
  }
};


exports.getBottoms = async (req, res) => {
  try {
    console.log("Fetching only Bottoms...");

    let sortOption = {};
    if (req.query.sort === "asc") {
      sortOption.price = 1; // Sắp xếp giá tăng dần
    } else if (req.query.sort === "desc") {
      sortOption.price = -1; // Sắp xếp giá giảm dần
    }

    const products = await Product.find({ type: "Bottoms" }).sort(sortOption);

    console.log("Bottoms found:", products.length);

    if (products.length === 0) {
      console.log("No Bottoms found in database");
    }

    res.render("bottoms", { products, user: req.session.user }); // Đảm bảo render đúng file `bottoms.ejs`
  } catch (error) {
    console.error("Error in getBottoms:", error);
    res.status(500).json({ message: "Server error", error: error.toString() });
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


exports.getAccessories = async (req, res) => {
  try {
    console.log("Fetching only accessories...");

    let sortOption = {};
    if (req.query.sort === "asc") {
      sortOption.price = 1; // Sắp xếp giá tăng dần
    } else if (req.query.sort === "desc") {
      sortOption.price = -1; // Sắp xếp giá giảm dần
    }

    const products = await Product.find({ type: "Accessories" }).sort(sortOption);

    console.log("Accessories found:", products.length);

    if (products.length === 0) {
      console.log("No Accessories found in database");
    }

    res.render("accessories", { products, user: req.session.user }); // Đảm bảo render đúng file `accessories.ejs`
  } catch (error) {
    console.error("Error in getAccessories:", error);
    res.status(500).json({ message: "Server error", error: error.toString() });
  }
};

exports.getOuterwears = async (req, res) => {
  try {
    console.log("Fetching only Outerwears...");

    let sortOption = {};
    if (req.query.sort === "asc") {
      sortOption.price = 1; // Sắp xếp giá tăng dần
    } else if (req.query.sort === "desc") {
      sortOption.price = -1; // Sắp xếp giá giảm dần
    }

    const products = await Product.find({ type: "Outerwears" }).sort(sortOption);

    console.log("Outerwears found:", products.length);

    if (products.length === 0) {
      console.log("No Outerwears found in database");
    }

    res.render("outerwears", { products, user: req.session.user }); // Đảm bảo render đúng file `outerwears.ejs`
  } catch (error) {
    console.error("Error in getOuterwears:", error);
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