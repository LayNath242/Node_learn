const express = require('express');

const {
    getAllCategorys,
    createCategory,
    getCategory,
    deleteCategory,
    updateCategory
} = require('../controller/category');

const router = express.Router();

router
    .route('/')
    .post(createCategory)
    .get(getAllCategorys);

router
    .route('/:id')
    .get(getCategory)
    .put(updateCategory)
    .delete(deleteCategory);

module.exports = router;
