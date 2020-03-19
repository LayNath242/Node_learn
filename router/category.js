const express = require('express');
const advancedResults = require('../middleware/advancedResults');
const Category = require('../models/Category');

const {
    getAllCategorys,
    createCategory,
    getCategory,
    deleteCategory,
    updateCategory
} = require('../controller/category');

//include other resource router
const postRouter = require('./post');

const router = express.Router({ mergeParams: true });

//re-route to other resource router
router.use('/:categoryId/post', postRouter);

router
    .route('/')
    .post(createCategory)
    .get(
        advancedResults(Category, {
            path: 'post',
            select: 'postTitle postDescription'
        }),
        getAllCategorys
    );

router
    .route('/:id')
    .get(getCategory)
    .put(updateCategory)
    .delete(deleteCategory);

module.exports = router;
