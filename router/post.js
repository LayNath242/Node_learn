const express = require('express');

const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const Post = require('../models/Post');

const {
    createPost,
    getPosts,
    getPost,
    updatePost,
    deletePost,
    PostPhotoUpload
} = require('../controller/post');

const router = express.Router({ mergeParams: true });

router
    .route('/')
    .post(protect, authorize('user', 'admin'), createPost)
    .get(
        advancedResults(Post, {
            path: 'category',
            select: 'cateName cateDescription'
        }),
        getPosts
    );

router
    .route('/:id')
    .get(getPost)
    .put(protect, authorize('user', 'admin'), updatePost)
    .delete(protect, authorize('user', 'admin'), deletePost);

router.route('/:id/photo').put(protect, authorize('user', 'admin'), PostPhotoUpload);

module.exports = router;
