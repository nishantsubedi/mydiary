const express = require('express');
const router = express.Router();

// get diary
router.get('/', (req, res) => {
    res.render('diary', {
        title: 'Diary'
    });
});

// GET write diaries page
router.get('/write', (req, res) => {
    res.render('diary/write', {
        title: 'Write a chapter'
    });
});


// Exports 
module.exports = router;