const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const config = require('./config/database');

// Connect to db
mongoose.connect(config.database);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error: '));
db.on('open', function() {
    console.log('Connected to mongodb');
})

