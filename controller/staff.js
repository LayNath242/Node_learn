const path = require('path');

const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');

const Staff = require('../models/Staff');

//------------------------------------------------------------------------
exports.createStaff = asyncHandler(async (req, res, next) => {
    const staff = await Staff.create(req.body);
    res.status(201).json({
        success: true,
        data: staff
    });
});

//------------------------------------------------------------------------
exports.getAllStaffs = asyncHandler(async (req, res, next) => {
    return res.status(200).json(res.advancedResults);
});

//------------------------------------------------------------------------
exports.getStaff = asyncHandler(async (req, res, next) => {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
        return next(new ErrorResponse(`Staff not found with id ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: staff });
});

//------------------------------------------------------------------------
exports.updateStaff = asyncHandler(async (req, res, next) => {
    const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!staff) {
        return next(new ErrorResponse(`Staff not found with id ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: staff });
});

//------------------------------------------------------------------------
exports.deleteStaff = asyncHandler(async (req, res, next) => {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) {
        return next(new ErrorResponse(`Staff not found with id ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: {} });
});

//------------------------------------------------------------------------
exports.getStaffInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;

    // Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // Calc radius using radians
    // Divide dist by radius of Earth
    // Earth Radius = 3,963 mi / 6,378 km
    const radius = distance / 6378;
    const staffs = await Staff.find({
        location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    });

    res.status(200).json({
        success: true,
        count: staffs.length,
        data: staffs
    });
});

exports.StaffPhotoUpload = asyncHandler(async (req, res, next) => {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
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

        await Staff.findByIdAndUpdate(
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
