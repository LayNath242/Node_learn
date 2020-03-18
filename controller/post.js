const Post = require('../models/Post');
const path = require('path');
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

exports.deletePost = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
        return next(new ErrorResponse(`post not found with id ${req.params.id}`, 404));
    }
    await post.remove();
    res.status(200).json({ success: true, data: {} });
});

exports.PostPhotoUpload = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
        return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
        );
    }

    if (!req.files) {
        return next(new ErrorResponse(`Please upload a file`, 404));
    }

    const file = req.files.file;

    // Make sure the image is a photo
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please upload an image file`, 404));
    }

    // Check filesize
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(
            new ErrorResponse(
                `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
                404
            )
        );
    }

    // Create custom filename
    file.name = [`photo_${file.md5}${path.parse(file.name).ext}`];

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            console.error(err);
            return next(new ErrorResponse(`Problem with file upload`, 500));
        }

        await Post.findByIdAndUpdate(req.param.id, { postImage: file.name });

        return res.status(200).json({
            success: true,
            data: file.name
        });
    });
});
