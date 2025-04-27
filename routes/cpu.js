const express = require('express');
const router = express.Router();

router.get('/cpu', (req, res) => {
    res.render('cpu'); // top.ejs nằm trong thư mục 'views'
});

module.exports = router;

