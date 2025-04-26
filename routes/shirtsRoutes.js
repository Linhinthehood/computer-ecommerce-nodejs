const express = require('express');
const router = express.Router();

router.get('/shirts', (req, res) => {
    res.render('shirts'); // top.ejs nằm trong thư mục 'views'
});

module.exports = router;

