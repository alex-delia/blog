const User = require('../models/user');

const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
require('dotenv').config();

//GET list of all authors
exports.author_list = asyncHandler(async (req, res, next) => {
    const allAuthors = await User.find({ accountType: 'author' }, 'firstName lastName')
        .sort({ firstName: 1 })
        .exec();

    if (allAuthors.length === 0) {
        const err = new Error("No Authors found");
        err.status = 404;
        return next(err);
    }

    res.json({ author_list: allAuthors });
});

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

        if (!errors.isEmpty()) {
            const err = new Error('Form Data is invalid');
            err.status = 400;
            err.details = errors.array();
            return next(err);
        }

        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword,
        });

        // Data from form is valid.
        // Save user.
        await user.save();

        const payload = { id: user._id, name: user.fullname, email: user.email };
        jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '7 days' }, (err, token) => {
            if (err) {
                res.status(403).json(err);
            } else {
                res.json({
                    message: "User Created",
                    name: `${user.firstName} ${user.lastName}`,
                    email: user.email,
                    token
                });
            }
        });
    })
];

//login user
exports.login = [
    body('email')
        .trim()
        .escape(),
    body('password')
        .trim()
        .escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const err = new Error('Form Data is invalid');
            err.status = 400;
            err.details = errors.array();
            return next(err);
        }

        passport.authenticate('local', { session: false }, (err, user) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                const err = new Error('Incorrect email or password.');
                err.status = 401;
                return next(err);
            }

            const payload = {
                id: user._id,
                name: user.fullname,
                email: user.email,
                accountType: user.accountType
            };

            jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '7 days' }, (err, token) => {
                if (err) {
                    return next(err);
                } else {
                    res.json({
                        message: "User Logged In Successfully",
                        name: `${user.firstName} ${user.lastName}`,
                        email: user.email,
                        token
                    });
                }
            });
        })(req, res, next);
    }
];

//delete user on DELETE
exports.user_delete = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.userId).exec();

    if (user === null) {
        // No results.
        const err = new Error("User not found");
        err.status = 404;
        return next(err);
    }

    res.json({
        message: 'User Deleted',
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
    });
});