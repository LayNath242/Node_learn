const Post = require('../models/Post');
const Category = require('../models/Category');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

exports.createPost = asyncHandler(async (req, res, next) => {
    const post = await Post.create(req.body);
    res.status(201).json({
        success: true,
        data: post
    });
});

exports.getPosts = asyncHandler(async (req, res, next) => {
    let query;

    if (req.params.categoryId) {
        query = Post.find({ category: req.params.categoryId });
    } else {
        query = Post.find().populate({
            path: 'category',
            select: 'cateName cateDescription'
        });
    }

    const posts = await query;
    return res.status(200).json({
        success: true,
        count: posts.length,
        data: posts
    });
});

exports.getPost = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id).populate({
        path: 'category',
        select: 'cateName cateDescription -_id'
    });
    if (!post) {
        return next(
            new ErrorResponse(`category not found with id ${req.params.id}`, 404)
        );
    }
    return res.status(200).json({ success: true, data: post });
});

exports.updatePost = asyncHandler(async (req, res, next) => {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!post) {
        return next(new ErrorResponse(`post not found with id ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: post });
});
