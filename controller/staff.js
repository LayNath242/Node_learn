const Staff = require('../models/Staff');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');

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
    const staff = await Staff.find();
    res.status(200).json({
        success: true,
        count: staff.length,
        data: staff
    });
});

//------------------------------------------------------------------------
exports.getStaff = asyncHandler(async (req, res, next) => {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
        return next(
            new ErrorResponse(`Resourse not found with id ${req.params.id}`, 404)
        );
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
        return next(
            new ErrorResponse(`Resourse not found with id ${req.params.id}`, 404)
        );
    }
    res.status(200).json({ success: true, data: staff });
});

//------------------------------------------------------------------------
exports.deleteStaff = asyncHandler(async (req, res, next) => {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) {
        return next(
            new ErrorResponse(`Resourse not found with id ${req.params.id}`, 404)
        );
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
