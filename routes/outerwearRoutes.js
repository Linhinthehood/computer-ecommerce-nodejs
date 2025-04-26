const express = require('express');
const router = express.Router();

router.get('/outerwears', (req, res) => {
    res.render('outerwears'); // top.ejs nằm trong thư mục 'views'
});

module.exports = router;

