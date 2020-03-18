const express = require('express');

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
    .post(createPost)
    .get(getPosts);

router
    .route('/:id')
    .get(getPost)
    .put(updatePost)
    .delete(deletePost);

router.route('/:id/photo').put(PostPhotoUpload);

module.exports = router;
