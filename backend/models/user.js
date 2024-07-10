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

userSchema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('User', userSchema);