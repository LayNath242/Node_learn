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
    image: [String],
    category: {
        type: mongoose.Schema.ObjectID,
        ref: 'Category',
        required: true
    }
});
module.exports = mongoose.model('Post', PostSchema);
