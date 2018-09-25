const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const exphandlebars = require('express-handlebars');

// GETTING NODE SASS MIDDLEWARE
const sassMiddleware = require('node-sass-middleware');
const path = require('path');

// LOAD USER MODEL
require('./models/User');

// PASSPORT CONFIG
require('./config/passport')(passport);

// LOAD ROUTES
const home = require('./routes/index');
const auth = require('./routes/auth');
const stories = require('./routes/stories');
// const about = require('./routes/auth');
// const verify = require('./routes/auth');
// const logout = require('./routes/auth');

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

// USING SASS MIDDLEWARE
app.use(
  sassMiddleware({
    src: path.join(__dirname, '/_scss'),
    dest: path.join(__dirname, '/_public'),
    debug: false,
  }),
);

// STATIC PUBLIC FOLDER
app.use(express.static(path.join(__dirname, '_public')));

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
app.use('/about', home);
app.use('/auth', auth);
app.use('/stories', stories);
// app.use('/auth/verify', auth);
// app.use('/auth/logout', auth);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
