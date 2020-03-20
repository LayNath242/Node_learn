const express = require('express');

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');
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
    .post(protect, authorize('user', 'admin'), createStaff)
    .get(protect, authorize('admin'), advancedResults(Staff), getAllStaffs);

router
    .route('/:id')
    .get(getStaff)
    .put(protect, authorize('user', 'admin'), updateStaff)
    .delete(protect, authorize('user', 'admin'), deleteStaff);

router.route('/:id/photo').patch(protect, authorize('user', 'admin'), StaffPhotoUpload);

module.exports = router;
