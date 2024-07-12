const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    accountType: {
        type: String,
        required: true,
        default: 'viewer',
        enum: ['viewer', 'author'],
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    }
});

userSchema.virtual('fullname').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

userSchema.virtual('url').get(function () {
    return `/authors/${this._id}`;
});

userSchema.virtual('postCount', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'author',
    count: true // only get the number of docs
});

userSchema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'author',
});

userSchema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('User', userSchema);