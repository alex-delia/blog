const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();

const indexRouter = require('./routes/index');
const postsRouter = require('./routes/posts');
const commentsRouter = require('./routes/comments');
const usersRouter = require('./routes/users');
const authorsRouter = require('./routes/authors');

const cors = require('cors');

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const mongoDB = process.env.MONGODB_URI;

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

const app = express();

app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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
  });
});

module.exports = app;
