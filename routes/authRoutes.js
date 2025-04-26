// routes/authRoutes.js

const express = require('express');
const router = express.Router();

// Import các hàm từ controller
const {
  getAuthPage,
  postRegister,
  postLogin
} = require('../controllers/authControllers');

// GET /auth => render trang auth.ejs
router.get('/auth', getAuthPage);

// POST /register => xử lý đăng ký
router.post('/register', postRegister);

// POST /login => xử lý đăng nhập
router.post('/login', postLogin);

// GET /logout => handle logout
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).send('Error logging out');
    }
    res.redirect('/auth');
  });
});

module.exports = router;