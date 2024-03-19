const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required']
    },
    description: {
        type: String
    },
    author: {
        type: String
    },
    features: [{
        type: String
    }],
    image: {
        type: String,
        required: [true, 'Product image is required']
    },
    style: {
        type: String
    },
    images: [{
        color: {
            type: String,
            default: 'default'
        },
        imageUrls : Array
    }],
    colors: [{
        name: String,
        code: String
    }],
    brand: {
        type: String,
        default: ''
    },
    currentPrice: {
        type: Number
    },
    mrpPrice: {
        type: Number
    },
    currency: {
        type: String,
        default: "INR"
    },
    categories: [{
        type: String
    }],
    weight: {
        type: String
    },
    sizes: [{
        type: String
    }],
    subcategory: [{
        subcategoryName: String,
        model: [{
            modelName: String,
            color: [{
                name: String,
                image: String
            }],
            size: [{
                val: Number,
                price: Number
            }]
        }]
    }],
    countInStock: {
        type: Number,
        min: 0,
        max: 2555
    },
    rating: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
}, {
    timestamps: true
});

// productSchema.index({'$**': 'text'});
productSchema.index({
    name: 'text',
    category: 'text',
    description: 'text',
    features: 'text',
    brand: 'text',
    colors: 'text',
    sizes: 'text'
});

productSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

productSchema.set('toJSON', {
    virtuals: true
});

mongoose.model('Product', productSchema);