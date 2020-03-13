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
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    },
    { timestamps: { updatedAt: 'updatedAt' } }
);

CategorySchema.pre('remove', async function(next) {
    await this.model('Post').deleteMany({
        category: this._id
    });
    next();
});

//revert populate with virtual
CategorySchema.virtual('post', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'category',
    justOne: false
});

module.exports = mongoose.model('Category', CategorySchema);
