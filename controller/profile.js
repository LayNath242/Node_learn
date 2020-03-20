const path = require('path');

const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');

const Profile = require('../models/Profile');

//------------------------------------------------------------------------
exports.createProfile = asyncHandler(async (req, res, next) => {
    req.body.user = req.user.id;

    // const userProfile =

    const profile = await Profile.create(req.body);
    res.status(201).json({
        success: true,
        data: profile
    });
});

//------------------------------------------------------------------------
exports.getAllProfiles = asyncHandler(async (req, res, next) => {
    return res.status(200).json(res.advancedResults);
});

//------------------------------------------------------------------------
exports.getProfile = asyncHandler(async (req, res, next) => {
    const profile = await Profile.findById(req.params.id);
    if (!profile) {
        return next(new ErrorResponse(`Profile not found with id ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: profile });
});

//------------------------------------------------------------------------
exports.updateProfile = asyncHandler(async (req, res, next) => {
    const profile = await Profile.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!profile) {
        return next(new ErrorResponse(`Profile not found with id ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: profile });
});

//------------------------------------------------------------------------
exports.deleteProfile = asyncHandler(async (req, res, next) => {
    const profile = await Profile.findByIdAndDelete(req.params.id);
    if (!profile) {
        return next(new ErrorResponse(`Profile not found with id ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: {} });
});

//------------------------------------------------------------------------
exports.getProfileInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;

    // Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // Calc radius using radians
    // Divide dist by radius of Earth
    // Earth Radius = 3,963 mi / 6,378 km
    const radius = distance / 6378;
    const profiles = await Profile.find({
        location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    });

    res.status(200).json({
        success: true,
        count: profiles.length,
        data: profiles
    });
});

exports.ProfilePhotoUpload = asyncHandler(async (req, res, next) => {
    const profile = await Profile.findById(req.params.id);
    if (!profile) {
        return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
        );
    }

    if (!req.files) {
        return next(new ErrorResponse(`Please upload a file`, 404));
    }

    const file = req.files.file;

    // Make sure the image is a photo
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please upload an image file`, 404));
    }

    // Check filesize
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(
            new ErrorResponse(
                `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
                404
            )
        );
    }

    // Create custom filename
    file.name = [`photo_${file.md5}${path.parse(file.name).ext}`];

    file.mv(`${process.env.FILE_UPLOAD_AVATAR}/${file.name}`, async err => {
        if (err) {
            console.error(err);
            return next(new ErrorResponse(`Problem with file upload`, 500));
        }

        await Profile.findByIdAndUpdate(
            req.params.id,
            { coverImage: String(file.name) },
            {
                new: true,
                runValidators: true
            }
        );

        return res.status(200).json({
            success: true,
            data: file.name
        });
    });
});
