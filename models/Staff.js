const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utils/geocoder');

const StaffSchema = mongoose.Schema(
    {
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
        salary: Number,
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
        location: {
            // GeoJSON Point
            type: {
                type: String,
                enum: ['Point']
            },
            coordinates: {
                type: [Number],
                index: '2dsphere'
            },
            formattedAddress: String,
            street: String,
            city: String,
            state: String,
            zipcode: String,
            country: String
        },
        coverImage: {
            type: String,
            default: 'no-photo.jpg'
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: { updatedAt: 'updatedAt' } }
);

StaffShema.pre('save', function(next) {
    this.slug = slugify(this.firstname + this.lastname, { lower: true });
    next();
});

StaffShema.pre('save', async function(next) {
    const loc = await geocoder.geocode(this.address);
    this.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        street: loc[0].streetName,
        city: loc[0].city,
        state: loc[0].stateCode,
        zipcode: loc[0].zipcode,
        country: loc[0].countyCode
    };

    // Do not save address in DB
    this.address = undefined;

    next();
});
module.exports = mongoose.model('Staff', StaffSchema);
