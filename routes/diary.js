const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('diary', {
        title: 'Diary'
    });
});

// Exports 
module.exports = router;