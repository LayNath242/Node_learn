const express = require('express');

const {
    createStaff,
    getAllStaffs,
    getStaff,
    updateStaff,
    deleteStaff,
    getStaffInRadius
} = require('../controller/staff');

const router = express.Router();

router.route('/radius/:zipcode/:distance').get(getStaffInRadius);

router
    .route('/')
    .post(createStaff)
    .get(getAllStaffs);

router
    .route('/:id')
    .get(getStaff)
    .put(updateStaff)
    .delete(deleteStaff);

module.exports = router;
