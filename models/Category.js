const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema(
    {
        cateName: {
            type: String,
            required: [true, 'Please add categogry name'],
            trim: true,
            unique: true
        },
        cateDescription: {
            type: String,
            required: [true, 'Please add category decription']
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: { updatedAt: 'updatedAt' } }
);

module.exports = mongoose.model('Category', CategorySchema);
