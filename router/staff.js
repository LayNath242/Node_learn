const express = require('express');

const advancedResults = require('../middleware/advancedResults');
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
    .post(createStaff)
    .get(advancedResults(Staff), getAllStaffs);

router
    .route('/:id')
    .get(getStaff)
    .put(updateStaff)
    .delete(deleteStaff);

router.route('/:id/photo').patch(StaffPhotoUpload);

module.exports = router;
