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
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    isPublished: {
        type: Boolean,
        required: true,
        default: false,
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
},
    { timestamps: true }
);

postSchema.virtual('url').get(function () {
    return `/posts/${this._id}`;
});

postSchema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('Post', postSchema);