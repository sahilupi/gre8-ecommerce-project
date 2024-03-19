const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const devEnv = require('../dev-env/dev-env');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User name is required']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'User email is required']
    },
    passwordHash: {
        type: String,
        required: [true, 'User password is required']
    },
    phone: {
        type: String
    },
    company: {
        type: String
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    resettoken: {
        type: String
    },
    cart: {
        items: [{
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            size: {
                type: String || Number
            }
        }]
    },
    wishlist: {
        items: [{
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            size: {
                type: String || Number
            }
        }]
    },
    address: {
        type: Object,
        street: {
            type: String
        },
        apartment: {
            type: String
        },
        city: {
            type: String,
        },
        zip: {
            type: String
        },
        country: {
            type: String
        }
    },
    saltSecret: String,
}, {
    timestamps: true
});

userSchema.methods.addToCart = function (product, productQuantity, increaseQuantity, size) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
    if (cartProductIndex >= 0) {
        if (productQuantity >= 1 && !increaseQuantity) {
            newQuantity = productQuantity;
        } else {
            newQuantity = this.cart.items[cartProductIndex].quantity + productQuantity;
        }
        updatedCartItems[cartProductIndex].quantity = newQuantity;
        // console.log(product)
        if(size) {
            updatedCartItems[cartProductIndex].size = size;
        }
    } else {
        newQuantity = productQuantity ? +productQuantity : newQuantity;

        if(size) {
            updatedCartItems.push({
                productId: product._id,
                quantity: newQuantity,
                size: size
            });
        }
        else {
            updatedCartItems.push({
                productId: product._id,
                quantity: newQuantity
            });
        }
       
    }
    const updatedCart = {
        items: updatedCartItems
    };
    this.cart = updatedCart;
    return this.save();
};

userSchema.methods.addMultipleToCart = function (products) {
    const updatedCartItems = [...this.cart.items];
    let newQuantity = 1;
    if (this.cart && this.cart.items.length > 0) {
        const cartProdIds = [];
        this.cart.items.map(cp => {
            cartProdIds.push(cp.productId.toString());
        })
        products.map((p, index) => {
            if (cartProdIds.includes(p.productId.toString())) {
                if (this.cart.items[index]) {
                    newQuantity = this.cart.items[index].quantity + p.quantity;
                    updatedCartItems[index].quantity = newQuantity;
                }
            } else {
                updatedCartItems.push({
                    productId: p.productId,
                    quantity: p.quantity
                })
            }
        });
    } else {
        products.map(p => {
            updatedCartItems.push({
                productId: p.productId,
                quantity: p.quantity
            });
        })
    }
    const updatedCart = {
        items: updatedCartItems
    };
    this.cart = updatedCart;
    return this.save();
};

userSchema.methods.removeFromCart = function (productId) {
    const updatedCartItems = this.cart.items.filter(item => {
        return item.productId.toString() !== productId.toString();
    });
    this.cart.items = updatedCartItems;
    return this.save();
};

userSchema.methods.clearCart = function () {
    this.cart = {
        items: []
    };
    return this.save();
};

userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtuals: true
});

// Custom validation for email
userSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');

// Methods
userSchema.statics.hashPassword = function hashPassword(password) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(this.password, salt, (err, hash) => {
            this.password = hash;
            this.saltSecret = salt;
        });
    });
    return bcrypt.hashSync(password, 10);
}

userSchema.methods.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.passwordHash);
};

userSchema.methods.generateJwt = function (remeberMe) {
    return jwt.sign({
            _id: this._id,
            isAdmin: this.isAdmin
        },
        process.env.JWT_SECRET || devEnv.JWT_SECRET, {
            expiresIn: remeberMe ? '365d' : process.env.JWT_EXP || devEnv.JWT_EXP
        });
}


userSchema.methods.addToWishlist = function (product, productQuantity, increaseQuantity, size) {
    const wishlistProductIndex = this.wishlist.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedWishlistItems = [...this.wishlist.items];
    if (wishlistProductIndex >= 0) {
        if (productQuantity >= 1 && !increaseQuantity) {
            newQuantity = productQuantity;
        } else {
            newQuantity = this.wishlist.items[wishlistProductIndex].quantity + productQuantity;
        }
        updatedWishlistItems[wishlistProductIndex].quantity = newQuantity;
        // console.log(product)
        if(size) {
            updatedWishlistItems[wishlistProductIndex].size = size;
        }
    } else {
        newQuantity = productQuantity ? +productQuantity : newQuantity;

        if(size) {
            updatedWishlistItems.push({
                productId: product._id,
                quantity: newQuantity,
                size: size
            });
        }
        else {
            updatedWishlistItems.push({
                productId: product._id,
                quantity: newQuantity
            });
        }
       
    }
    const updatedWishlist = {
        items: updatedWishlistItems
    };
    this.wishlist = updatedWishlist;
    return this.save();
};

userSchema.methods.addMultipleToWishlist = function (products) {
    const updatedWishlistItems = [...this.wishlist.items];
    let newQuantity = 1;
    if (this.wishlist && this.wishlist.items.length > 0) {
        const wishlistProdIds = [];
        this.wishlist.items.map(cp => {
            wishlistProdIds.push(cp.productId.toString());
        })
        products.map((p, index) => {
            if (wishlistProdIds.includes(p.productId.toString())) {
                if (this.wishlist.items[index]) {
                    newQuantity = this.wishlist.items[index].quantity + p.quantity;
                    updatedWishlistItems[index].quantity = newQuantity;
                }
            } else {
                updatedWishlistItems.push({
                    productId: p.productId,
                    quantity: p.quantity
                })
            }
        });
    } else {
        products.map(p => {
            updatedWishlistItems.push({
                productId: p.productId,
                quantity: p.quantity
            });
        })
    }
    const updatedWishlist = {
        items: updatedWishlistItems
    };
    this.wishlist = updatedWishlist;
    return this.save();
};

userSchema.methods.removeFromWishlist = function (productId) {
    const updatedWishlistItems = this.wishlist.items.filter(item => {
        return item.productId.toString() !== productId.toString();
    });
    this.wishlist.items = updatedWishlistItems;
    return this.save();
};

userSchema.methods.clearWishlist = function () {
    this.wishlist = {
        items: []
    };
    return this.save();
};

mongoose.model('User', userSchema);