const express = require('express');
const router = express.Router();

router.get('/accessories', (req, res) => {
    res.render('accessories'); // top.ejs nằm trong thư mục 'views'
});

module.exports = router;

