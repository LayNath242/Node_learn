const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

const User = require('../models/User');

exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        role
    });
    sendTokenResponse(user, 200, res);
});

exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorResponse('please provide email and password to login', 400));
    }
    // check user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendTokenResponse(user, 200, res);
});

// get token from model, create cookie and send response

const sendTokenResponse = (user, statusCode, res) => {
    // creatr token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIR * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };
    return res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token
        });
};