const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const exphandlebars = require('express-handlebars');

// LOAD USER MODEL
require('./models/User');

// PASSPORT CONFIG
require('./config/passport')(passport);

// LOAD ROUTES
const home = require('./routes/home');
const auth = require('./routes/auth');
const verify = require('./routes/auth');
const logout = require('./routes/auth');

// LOAD KEYS
const keys = require('./config/keys');

// GETS RID OF DEPRICATION WARNINGS
mongoose.Promise = global.Promise;

// DB CONFIG
// const db = require('./config/database');

// CONNECTING TO MONGO DB WITH MONGOOSE
mongoose
  .connect(
    keys.mongoURI,
    {
      useNewUrlParser: true,
    },
  )
  .then(() => console.log('Connected to MongoDB ...'))
  .catch(err => console.error(`Could not connect to MongoDB: ${err}`));

// APP INIT
const app = express();

// HANDLEBAR MIDDLEWARE
app.engine(
  'handlebars',
  exphandlebars({
    defaultLayout: 'main',
  }),
);
app.set('view engine', 'handlebars');

// COOKIE PARSER
app.use(cookieParser());

// SESSION MIDDLEWARE
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    // cookie: { maxAge: 60000 }
  }),
);

// PASSPORT MIDDLEWARE
app.use(passport.initialize());
app.use(passport.session());

// GLOBAL VARS
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// USE ROUTES
app.use('/', home);
app.use('/auth', auth);
app.use('/auth/verify', verify);
app.use('/auth/logout', logout);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
