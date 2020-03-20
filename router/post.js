const express = require('express');

const { protect } = require('../middleware/auth');
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
    .post(protect, createPost)
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
    .put(protect, updatePost)
    .delete(protect, deletePost);

router.route('/:id/photo').put(protect, PostPhotoUpload);

module.exports = router;
