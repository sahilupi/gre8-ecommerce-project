const mongoose = require('mongoose');

const contactDetailsSchema = new mongoose.Schema({
    phone: {
        type: Array,
        trim: true,
        required: [true, 'Phone number mandatory']
    },
    email: {
        type: Array,
        trim: true,
        required: [true, 'Email can\'t be empty']
    },
    socialMediaLinks: {
        facebook: {
            type: String,
            trim: true
        },
        twitter: {
            type: String,
            trim: true
        },
        instagram: {
            type: String,
            trim: true
        }
    }
}, {
    timestamps: true
});

mongoose.model('ContactDetail', contactDetailsSchema);