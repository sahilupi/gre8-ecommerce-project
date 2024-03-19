const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    quantity: {
        type: Number,
        required: [true, 'Quantity is required']
    },
    size: {
        type: String || Number
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }
}, {
    timestamps: true
});

mongoose.model('OrderItem', orderItemSchema);