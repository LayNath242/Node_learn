const express = require('express');

const { protect } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const Category = require('../models/Category');

const {
    getAllCategorys,
    createCategory,
    deleteCategory,
    updateCategory
} = require('../controller/category');

//include other resource router
const postRouter = require('./post');

const router = express.Router({ mergeParams: true });

//re-route to other resource router
router.use('/:categoryId/post', advancedResults(Category), postRouter);

router
    .route('/')
    .post(protect, createCategory)
    .get(getAllCategorys);

router
    .route('/:id')
    .put(protect, updateCategory)
    .delete(protect, deleteCategory);

module.exports = router;
