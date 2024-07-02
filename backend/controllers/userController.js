const User = require('../models/user');

const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");

//create user on POST
exports.user_create = asyncHandler(async (req, res, next) => {
    res.send('POST request for new user');
});

//delete user on DELETE
exports.user_delete = asyncHandler(async (req, res, next) => {
    res.send(`DELETE request for deleting user: ${req.params.userId}`);
});