const Category = require('../models/Category');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

exports.createCategory = asyncHandler(async (req, res, next) => {
    const category = await Category.create(req.body);
    res.status(201).json({
        success: true,
        data: category
    });
});

exports.getAllCategorys = asyncHandler(async (req, res, next) => {
    return res.status(200).json(res.advancedResults);
});

exports.getCategory = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id).populate('post');
    if (!category) {
        return next(
            new ErrorResponse(`Category not found with id ${req.params.id}`, 404)
        );
    }
    res.status(200).json({ success: true, data: category });
});

exports.updateCategory = asyncHandler(async (req, res, next) => {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!category) {
        return next(
            new ErrorResponse(`Category not found with id ${req.params.id}`, 404)
        );
    }
    res.status(200).json({ success: true, data: category });
});

exports.deleteCategory = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        return next(
            new ErrorResponse(`Category not found with id ${req.params.id}`, 404)
        );
    }
    await category.remove();
    res.status(200).json({ success: true, data: {} });
});
