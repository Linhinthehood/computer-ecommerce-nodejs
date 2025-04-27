const express = require('express');
const router = express.Router();

router.get('/laptop', (req, res) => {
    res.render('laptop'); // top.ejs nằm trong thư mục 'views'
});

module.exports = router;

