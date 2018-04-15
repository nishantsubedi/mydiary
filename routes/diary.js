const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('diary');
});

// Exports 
module.exports = router;