const express = require('express');
const router = express.Router();

router.get('/hdd', (req, res) => {
    res.render('hdd'); // top.ejs nằm trong thư mục 'views'
});

module.exports = router;

