const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
    cateName: {
        type: String,
        required: [true, 'Please add categogry name'],
        trim: true
    },
    cateDescription: {
        type: String,
        required: [true, 'Please add category decription']
    }
});

module.exports = mongoose.model('Category', CategorySchema);
