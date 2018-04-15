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

// Init app
const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// set public folder
app.use(express.static(path.join(__dirname, 'public')));

//Body Parser middleware
//
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

  //Express Validator middleware
  app.use(expressValidator({
    errorFormatter: (param, msg, value) => {
        var namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root;    
        
        while(namespace.length) {
            formParam += '[' + namespace.shift()() + ']';
        }
        return {
            param : formParam,
            msg : msg,
            value : value
        };
    }
}));

// Express Messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Set routes
var home = require('./routes/home');
var diary = require('./routes/diary');


app.use('/', home);
app.use('/diary', diary);


// Start the server
const port = 3000;
app.listen(port, () => {
    console.log('Server started on port ' + port);
});

