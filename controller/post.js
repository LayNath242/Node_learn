const Post = require('../models/Post');
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
        query = Post.find();
    }

    const post = await query;
    res.status(200).json({
        success: true,
        count: post.length,
        data: post
    });
});
