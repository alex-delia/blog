const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: [true, 'Post Title is required.']
    },
    text: {
        type: String,
        required: [true, 'Post Text is required.']
    },
    description: {
        type: String,
        required: [true, 'Post Description is required.']
    },
    isPublished: {
        type: Boolean,
        required: true,
        default: false,
    },
    createdAt: {
        type: Date,
        immutable: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
},
);

postSchema.virtual('url').get(function () {
    return `/posts/${this._id}`;
});

postSchema.set('toJSON', {
    virtuals: true
});

postSchema.pre('save', function (next) {
    if (!this.createdAt) {
        console.log('CREATED');
        this.createdAt = Date.now();
        this.updatedAt = this.createdAt;
        next();
    }

    if (this.isModified('title') || this.isModified('text') || this.isModified('description')) {
        this.updatedAt = Date.now();
    }
    next();
});


module.exports = mongoose.model('Post', postSchema);