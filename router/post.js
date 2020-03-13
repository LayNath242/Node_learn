const express = require('express');

const { createPost, getPosts } = require('../controller/post');

const router = express.Router();

router
    .route('/')
    .post(createPost)
    .get(getPosts);

module.exports = router;
