const express = require('express');
const router = express.Router();

router.get('/ssd', (req, res) => {
    res.render('ssd'); // top.ejs nằm trong thư mục 'views'
});

module.exports = router;

