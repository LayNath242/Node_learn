const mongoose = require('mongoose');

const PostSchema = mongoose.Schema(
    {
        postTitle: {
            type: String,
            required: [true, 'Please add title for post'],
            trim: true
        },
        postDescription: {
            type: String,
            required: [true, 'Please add decription for post']
        },
        postImage: [String],
        category: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }
        ],
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: { updatedAt: 'updatedAt' } }
);
module.exports = mongoose.model('Post', PostSchema);
