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
    let query;

    const reqQuery = { ...req.query };

    const removeFields = ['select', 'sort', 'page', 'limit'];

    removeFields.forEach(param => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    query = Staff.find(JSON.parse(queryStr));

    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Staff.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Execute query
    const staff = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        };
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        };
    }

    res.status(200).json({
        success: true,
        count: staff.length,
        pagination,
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
