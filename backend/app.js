const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const compression = require('compression');
require("helmet");
require('dotenv').config();

const indexRouter = require('./routes/index');
const postsRouter = require('./routes/posts');
const commentsRouter = require('./routes/comments');
const usersRouter = require('./routes/users');
const authorsRouter = require('./routes/authors');

const User = require('./models/user');

const mongoose = require('mongoose');
const { default: helmet } = require('helmet');
mongoose.set('strictQuery', false);
const mongoDB = process.env.DATABASE_URL;

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

const app = express();

app.use(helmet());
app.use(compression());
app.use(cors({
  origin: ["https://alexdeliadjdashboard.netlify.app", "https://alexdeliadjblog.netlify.app"],
  optionsSuccessStatus: 200,
  allowedHeaders: ['Content-Type', 'Authorization']
}));



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

passport.use(
  new LocalStrategy({
    usernameField: 'email',
  }, async (username, password, done) => {
    try {
      const user = await User.findOne({ email: username });

      if (!user) {
        return done(null, false);
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false);
      }
      return done(null, user);

    } catch (err) {
      return done(err);
    }
  }
  ));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  };
});

app.use('/', indexRouter);
app.use('/posts', postsRouter);
app.use('/posts/:postId/comments', commentsRouter);
app.use('/users', usersRouter);
app.use('/authors', authorsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // render the error page
  res.status(err.status || 500).json({
    error: err.name,
    message: err.message,
    code: err.status || 500,
    details: err.details || null,
    stack: err.stack,
  });
});

module.exports = app;
