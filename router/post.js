const express = require('express');

const { createPost, getPosts, getPost } = require('../controller/post');

const router = express.Router({ mergeParams: true });

router
    .route('/')
    .post(createPost)
    .get(getPosts);

router.route('/:id').get(getPost);
// .put(updateStaff)
// .delete(deleteStaff);

module.exports = router;
