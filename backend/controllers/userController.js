const User = require('../models/user');

const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');

//GET author details
exports.author_detail = asyncHandler(async (req, res, next) => {
    const author = await User.findById(req.params.authorId, 'firstName lastName').exec();

    if (author === null) {
        // No results.
        const err = new Error("Author not found");
        err.status = 404;
        return next(err);
    }

    res.json({ author });
});

//GET user details
exports.author_list = asyncHandler(async (req, res, next) => {
    const allAuthors = await User.find({ accountType: 'author' }, 'firstName lastName')
        .sort({ firstName: 1 })
        .exec();

    res.json({ allAuthors });
});

//create user on POST
exports.user_create = [
    body('firstName')
        .trim()
        .isLength({ min: 1 })
        .withMessage('First Name must be specified.')
        .escape(),
    body('lastName')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Last Name must be specified.')
        .escape(),
    body('email')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Email must be specified.')
        .isEmail()
        .withMessage('Email format is invalid.')
        .custom(async value => {
            const user = await User.findOne({ email: value });
            if (user) {
                throw new Error('E-mail already in use');
            }
        })
        .escape(),
    body('password')
        .trim()
        .isStrongPassword()
        .withMessage('Password must be at least 8 characters and include: 1 Uppercase, 1 Lowercase, 1 Number, 1 Symbol')
        .escape(),
    body('confirmPassword')
        .trim()
        .custom((value, { req }) => {
            if (value !== req.body.password || value === '') {
                throw new Error('Password\'s must match');
            }
            return true;
        })
        .escape(),

    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword,
        });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.status(400).json(errors.array());
            return;
        }

        // Data from form is valid.
        // Save user.
        await user.save();
        res.json({
            message: "User Created",
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
        });
    })
];

//delete user on DELETE
exports.user_delete = asyncHandler(async (req, res, next) => {
    res.send(`DELETE request for deleting user: ${req.params.userId}`);
});