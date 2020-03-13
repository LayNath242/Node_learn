const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
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
    categoryId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: true
    }
});
module.exports = mongoose.model('Post', PostSchema);
