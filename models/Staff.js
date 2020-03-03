const mongoose = require('mongoose');

const StaffShema = mongoose.Schema({
    firstname: {
        type: String,
        required: [true, 'Please add a first name'],
        trim: true,
        maxlength: [32, 'Name can not be more than 32 characters']
    },
    lastname: {
        type: String,
        required: [true, 'Please add a last name'],
        trim: true,
        maxlength: [32, 'Name can not be more than 32 characters']
    },
    slug: String,
    positions: {
        type: String,
        required: [true, 'Please add your positions'],
        maxlength: [52, 'Name can not be more than 52 characters']
    },
    startedAt: {
        type: Date,
        required: [true, 'Please fill your date you start work']
    },
    gender: {
        type: [String],
        enum: ['M', 'F']
    },
    dateOfBirth: {
        type: Date
    },
    phone: {
        type: String,
        maxlength: [20, 'Phone number can not be longer than 20 characters']
    },
    email: {
        type: String,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    address: {
        type: String
    },
    coverImage: {
        type: String,
        default: 'no-photo.jpg'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
