const Staff = require('../models/Staff');

//------------------------------------------------------------------------
exports.createStaff = async (req, res, next) => {
    try {
        const staff = await Staff.create(req.body);
        res.status(201).json({
            success: true,
            data: staff
        });
    } catch (error) {
        res.status(400).json({
            success: false
        });
    }
};

//------------------------------------------------------------------------
exports.getAllStaffs = async (req, res, next) => {
    try {
        const staff = await Staff.find();
        res.status(200).json({
            success: true,
            count: staff.length,
            data: staff
        });
    } catch (error) {
        res.status(400).json({ success: false });
    }
};

//------------------------------------------------------------------------
exports.getStaff = async (req, res, next) => {
    try {
        const staff = await Staff.findById(req.params.id);
        if (!staff) {
            res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: staff });
    } catch (error) {
        res.status(400).json({ success: false });
    }
};

//------------------------------------------------------------------------
exports.updateStaff = async (req, res, next) => {
    try {
        const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!staff) {
            res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: staff });
    } catch (error) {
        res.status(400).json({ success: false });
    }
};

//------------------------------------------------------------------------
exports.deleteStaff = async (req, res, next) => {
    try {
        const staff = await Staff.findByIdAndDelete(req.params.id);
        if (!staff) {
            res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false });
    }
};
