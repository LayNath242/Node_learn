const express = require('express');

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');
const Profile = require('../models/Profile');

const {
    createProfile,
    getAllProfiles,
    getProfile,
    updateProfile,
    deleteProfile,
    getProfileInRadius,
    ProfilePhotoUpload
} = require('../controller/profile');

const router = express.Router();

router.route('/radius/:zipcode/:distance').get(getProfileInRadius);

router
    .route('/')
    .post(protect, authorize('user', 'admin'), createProfile)
    .get(protect, advancedResults(Profile), getAllProfiles);

router
    .route('/:id')
    .get(getProfile)
    .put(protect, authorize('user', 'admin'), updateProfile)
    .delete(protect, authorize('user', 'admin'), deleteProfile);

router.route('/:id/photo').put(protect, authorize('user', 'admin'), ProfilePhotoUpload);

module.exports = router;
