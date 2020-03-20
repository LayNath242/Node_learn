const express = require('express');

const advancedResults = require('../middleware/advancedResults');
const { protect } = require('../middleware/auth');
const Staff = require('../models/Staff');

const {
    createStaff,
    getAllStaffs,
    getStaff,
    updateStaff,
    deleteStaff,
    getStaffInRadius,
    StaffPhotoUpload
} = require('../controller/staff');

const router = express.Router();

router.route('/radius/:zipcode/:distance').get(getStaffInRadius);

router
    .route('/')
    .post(protect, createStaff)
    .get(advancedResults(Staff), getAllStaffs);

router
    .route('/:id')
    .get(getStaff)
    .put(protect, updateStaff)
    .delete(protect, deleteStaff);

router.route('/:id/photo').patch(protect, StaffPhotoUpload);

module.exports = router;
