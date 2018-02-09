const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');

const app = express();

// Load Routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/database');

// Mongoose Middleware
mongoose.Promise = global.Promise;

mongoose.connect(db.mongoURI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// HandleBars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Method-Override Middleware
app.use(methodOverride('_method'));

// Session-Express Middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Postport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect-Flash Middleware
app.use(flash());

// Global Variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})

// Home Page
app.get('/', (req, res) => {
    const title = 'Welcome';
    res.render("index", {
        title: title
    });
});

// About Route
app.get('/about', (req, res) => {
    res.render('about');
})

// Use Routes
app.use('/ideas', ideas);
app.use('/users', users);


const PORT = process.env.PORT || 3000;
//Listener
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
});