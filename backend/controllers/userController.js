const User = require('../models/user');

const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");

//GET user details
exports.author_detail = asyncHandler(async (req, res, next) => {
    res.send(`GET request to author user: ${req.params.authorId}`);
});

//GET user details
exports.author_list = asyncHandler(async (req, res, next) => {
    res.send(`GET request for authors list`);
});

//create user on POST
exports.user_create = asyncHandler(async (req, res, next) => {
    res.send('POST request for new user');
});

//delete user on DELETE
exports.user_delete = asyncHandler(async (req, res, next) => {
    res.send(`DELETE request for deleting user: ${req.params.userId}`);
});