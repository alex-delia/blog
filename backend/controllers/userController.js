const User = require('../models/user');

const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");

//GET author details
exports.author_detail = asyncHandler(async (req, res, next) => {
    const author = await User.findById(req.params.authorId, 'firstName lastName').exec();

    if (author === null) {
        // No results.
        const err = new Error("Author not found");
        err.status = 404;
        return next(err);
    }

    res.json(author);
});

//GET user details
exports.author_list = asyncHandler(async (req, res, next) => {
    const allAuthors = await User.find({ accountType: 'author' }, 'firstName lastName')
        .sort({ firstName: 1 })
        .exec();

    res.json(allAuthors);
});

//create user on POST
exports.user_create = asyncHandler(async (req, res, next) => {
    res.send('POST request for new user');
});

//delete user on DELETE
exports.user_delete = asyncHandler(async (req, res, next) => {
    res.send(`DELETE request for deleting user: ${req.params.userId}`);
});