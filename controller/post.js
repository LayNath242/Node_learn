const path = require('path');

const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

const Post = require('../models/Post');
const Category = require('../models/Category');

exports.createPost = asyncHandler(async (req, res, next) => {
    req.body.user = req.user.id;

    for (let i = 0; i < req.body.category.length; i++) {
        const category = await Category.findById(req.body.category[i]);
        if (!category) {
            return next(
                new ErrorResponse(`category not found with id ${req.body.category}`, 404)
            );
        }
    }

    const post = await Post.create(req.body);
    res.status(201).json({
        success: true,
        data: post
    });
});

exports.getPosts = asyncHandler(async (req, res, next) => {
    if (req.params.categoryId) {
        // const posts = await Post.find({ category: req.params.categoryId });
        let query;

        const reqQuery = { ...req.query };

        const removeFields = ['select', 'sort', 'page', 'limit'];

        removeFields.forEach(param => delete reqQuery[param]);

        let queryStr = JSON.stringify(reqQuery);

        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        query = Post.find({ category: req.params.categoryId }, JSON.parse(queryStr));

        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }

        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await Post.countDocuments();

        query = query.skip(startIndex).limit(limit);

        // Execute query
        const posts = await query;

        // Pagination result
        const pagination = {};

        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit
            };
        }

        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            };
        }

        return res.status(200).json({
            success: true,
            count: posts.length,
            pagination,
            data: posts
        });
    } else {
        res.status(200).json(res.advancedResults);
    }
});

exports.getPost = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id).populate({
        path: 'category',
        select: 'cateName cateDescription'
    });
    if (!post) {
        return next(
            new ErrorResponse(`category not found with id ${req.params.id}`, 404)
        );
    }
    return res.status(200).json({ success: true, data: post });
});

exports.updatePost = asyncHandler(async (req, res, next) => {
    for (let i = 0; i < req.body.category.length; i++) {
        const category = await Category.findById(req.body.category[i]);
        if (!category) {
            return next(
                new ErrorResponse(`category not found with id ${req.body.category}`, 404)
            );
        }
    }

    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!post) {
        return next(new ErrorResponse(`post not found with id ${req.params.id}`, 404));
    }

    if (post.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `User ${req.params.id} is not authorized to update this post`,
                401
            )
        );
    }
    res.status(200).json({ success: true, data: post });
});

exports.deletePost = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
        return next(new ErrorResponse(`post not found with id ${req.params.id}`, 404));
    }
    if (post.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `User ${req.params.id} is not authorized to update this post`,
                401
            )
        );
    }
    await post.remove();
    res.status(200).json({ success: true, data: {} });
});

exports.PostPhotoUpload = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
        return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
    }
    if (post.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `User ${req.params.id} is not authorized to update this post`,
                401
            )
        );
    }

    if (!req.files) {
        return next(new ErrorResponse(`Please upload a file`, 404));
    }
    const file = req.files.file;
    data = [];
    if (file.length > 1) {
        for (let i = 0; i < file.length; i++) {
            if (!file[i].mimetype.startsWith('image')) {
                return next(new ErrorResponse(`Please upload an image file`, 404));
            }

            // Check filesize
            if (file[i].size > process.env.MAX_FILE_UPLOAD) {
                return next(
                    new ErrorResponse(
                        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
                        404
                    )
                );
            }

            // Create custom filename
            file[i].name = `photo_${file[i].md5}${path.parse(file[i].name).ext}`;

            data.push(file[i].name);

            file[i].mv(`${process.env.FILE_UPLOAD_PATH}/${file[i].name}`, async err => {
                if (err) {
                    console.error(err);
                    return next(new ErrorResponse(`Problem with file upload`, 500));
                }

                await Post.findByIdAndUpdate(
                    req.params.id,
                    { postImage: data },
                    {
                        new: true,
                        runValidators: true
                    }
                );
                try {
                    return res.status(200).json({
                        success: true,
                        data: data
                    });
                } catch (error) {}
            });
        }
    } else {
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

            await Post.findByIdAndUpdate(
                req.params.id,
                { postImage: file.name },
                {
                    new: true,
                    runValidators: true
                }
            );

            return res.status(200).json({
                success: true,
                data: file.name
            });
        });
    }
});
