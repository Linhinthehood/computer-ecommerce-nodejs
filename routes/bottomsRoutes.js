const express = require('express');
const router = express.Router();

router.get('/bottoms', (req, res) => {
    res.render('bottoms'); // top.ejs nằm trong thư mục 'views'
});

module.exports = router;

