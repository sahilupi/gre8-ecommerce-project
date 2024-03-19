const mongoose = require('mongoose');

const User = mongoose.model('User');
const Product = mongoose.model('Product');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const devEnv = require('../dev-env/dev-env');

const userExists = async (email) => {
    const user = await User.findOne({
        email: email.toLowerCase().trim()
    })
    if (user) {
        return true;
    } else {
        return false;
    }
}

module.exports.getUsers = (req, res, next) => {
    try {
        User.find().select('-passwordHash').then(users => {
            if (!users || users.length < 1) {
                return res.status(404).json({
                    success: false,
                    message: 'No users found.'
                });
            } else {
                return res.status(200).json({
                    success: true,
                    users: users
                });
            }
        }).catch(err => {
            return next(err);
        })
    } catch (err) {
        return next(err);
    }
}

module.exports.getUser = (req, res, next) => {
    try {
        const id = req.params.id ? req.params.id : req._id;
        User.findById(id).select('-passwordHash').then((user) => {
            if (!user) {
                return res.status(404).send({
                    success: false,
                    message: 'No account found with this email address!'
                });
            }
            return res.status(201).send({
                success: true,
                message: 'User fetched succussfully!',
                user: user
            });
        }).catch(err => {
            return next(err);
        })
    } catch (err) {
        return next(err);
    }
};

module.exports.postUser = async (req, res, next) => {
    try {
        let user = new User({
            name: req.body.name,
            passwordHash: User.hashPassword(req.body.password),
            email: req.body.email,
            phone: req.body.phone,
            company: req.body.company,
            address: {
                street: req.body.street,
                apartment: req.body.apartment,
                city: req.body.city,
                zip: req.body.zip,
                country: req.body.country,
            }
        });

        // if (req.body.password !== req.body.confirmPassword) {
        //     return res.status(422).send({
        //         success: false,
        //         message: 'Passwords do not match'
        //     });
        // }

        if (await userExists(req.body.email)) {
            return res.status(409).json({
                success: false,
                message: 'Account with this email address exists already! Please try with different one'
            })
        }
        user.save().then((saveUser) => {
            if (!saveUser) {
                return res.status(500).send({
                    success: false,
                    message: 'An error occured! Please try again.'
                })
            }
            return res.status(200).send({
                success: true,
                message: 'Account created succussfully!'
            });
        }).catch(err => {
            if (err.code == 11000)
                return res.status(409).send({
                    success: false,
                    message: 'Account with this email address exists already!'
                });
            else
                return next(err);
        })

    } catch (err) {
        return next(err);
    }
}

module.exports.updateUser = async (req, res, next) => {
    try {
        User.findByIdAndUpdate(req.params.id).then((founededUser) => {
            if (!founededUser) {
                return res.status(404).send({
                    success: false,
                    message: 'No account found with this email address!'
                });
            } else {
                founededUser.isAdmin = req.body.isAdmin;
                if (req.body.name) {
                    founededUser.name = req.body.name;
                }
                if (req.body.email) {
                    founededUser.email = req.body.email;
                }
                if (req.body.password) {
                    founededUser.passwordHash = User.hashPassword(req.body.password);
                }
                if (req.body.phone) {
                    founededUser.phone = req.body.phone;
                }
                if (req.body.street || req.body.apartment || req.body.city || req.body.zip || req.body.country) {
                    founededUser.address = {
                        street: req.body.street,
                        city: req.body.city,
                        apartment: req.body.apartment,
                        zip: req.body.zip,
                        country: req.body.country,
                    };
                }
            };

            founededUser.save().then((savedUser) => {
                if (!savedUser) {
                    return res.status(503).send({
                        success: false,
                        message: 'Details can not be updated! Please try again.'
                    });
                }
                return res.status(201).send({
                    success: true,
                    message: 'Profile updated succussfully!',
                    user: savedUser
                });
            }).catch(err => {
                return next(err);
            });
        }).catch(err => {
            return next(err);
        })
    } catch (err) {
        return next(err);
    }
};

module.exports.updateUserProfile = async (req, res, next) => {
    try {
        User.findByIdAndUpdate(req._id).then((founededUser) => {
            if (!founededUser) {
                return res.status(404).send({
                    success: false,
                    message: 'No account found with this email address!'
                });
            } else {
                if (req.body.name) {
                    founededUser.name = req.body.name;
                }
                if (req.body.email) {
                    founededUser.email = req.body.email;
                }
                if (req.body.company) {
                    founededUser.company = req.body.company;
                }
                if (req.body.password) {
                    founededUser.passwordHash = User.hashPassword(req.body.password);
                }
                if (req.body.phone) {
                    founededUser.phone = req.body.phone;
                }
                if (req.body.address1 || req.body.apartment || req.body.city || req.body.zip || req.body.country) {
                    founededUser.address = {
                        street: req.body.address1,
                        city: req.body.city,
                        apartment: req.body.apartment,
                        zip: req.body.postalCode,
                        country: req.body.country,
                    };
                }
            };

            founededUser.save().then((savedUser) => {
                if (!savedUser) {
                    return res.status(503).send({
                        success: false,
                        message: 'Details can not be updated! Please try again.'
                    });
                }
                return res.status(201).send({
                    success: true,
                    message: 'Profile updated succussfully!',
                    user: savedUser
                });
            }).catch(err => {
                return next(err);
            });
        }).catch(err => {
            return next(err);
        })
    } catch (err) {
        return next(err);
    }
};

module.exports.authenticateUser = (req, res, next) => {
    try {
        User.findOne({
            email: req.body.email
        }).then((user) => {
            if (!user) {
                return res.status(404).send({
                    success: false,
                    message: 'No account found with this email address!'
                });
            } else if (!user.verifyPassword(req.body.password)) {
                return res.status(401).send({
                    success: false,
                    message: 'Incorrect password'
                });
            }
            return res.status(200).send({
                success: true,
                message: 'User fetched succussfully!',
                _id: user['_id'],
                name: user['name'],
                token: user.generateJwt(req.body.remeberMe)
            });
        }).catch(err => {
            return next(err);
        })
    } catch (err) {
        return next(err);
    }
};

module.exports.authenticateUserAsAdmin = (req, res, next) => {
    try {
        User.findOne({
            email: req.body.email
        }).then((user) => {
            if (!user) {
                return res.status(404).send({
                    success: false,
                    message: 'No account found with this email address!'
                });
            } else if (!user.verifyPassword(req.body.password)) {
                return res.status(401).send({
                    success: false,
                    message: 'Incorrect password'
                });
            } else if (!user.isAdmin) {
                return res.status(401).send({
                    message: 'Not Authorized.'
                });
            }
            return res.status(200).send({
                success: true,
                message: 'User fetched succussfully!',
                _id: user['_id'],
                name: user['name'],
                token: user.generateJwt(req.body.remeberMe)
            });
        }).catch(err => {
            return next(err);
        })
    } catch (err) {
        return next(err);
    }
};

module.exports.getUserCount = (req, res, next) => {
    try {
        User.countDocuments().then(userCount => {
            if (!userCount || userCount.length < 1) {
                return res.status(404).json({
                    success: false,
                    message: 'No Users found.'
                });
            } else {
                return res.status(200).json({
                    success: true,
                    userCount: userCount
                });
            }
        }).catch(err => {
            return next(err);
        })
    } catch (err) {
        return next(err);
    }
};

module.exports.deleteUser = (req, res, next) => {
    try {
        User.findByIdAndRemove(req.params.id).then((user) => {
            if (!user) {
                return res.status(404).send({
                    success: false,
                    message: 'User not found!'
                });
            }
            return res.status(201).send({
                success: true,
                message: 'User account deleted succussfully!'
            });
        }).catch(err => {
            return next(err);
        })
    } catch (err) {
        return next(err);
    }
};

// User Cart methods
module.exports.postCart = async (req, res, next) => {
    const user = await User.findById(req._id);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'No account found with this id'
        })
    }
    const prodId = req.body.productId;
    const quantity = req.body.quantity;
    Product.findById(prodId)
        .then(product => {
            return user.addToCart(product, quantity, req.body.increaseQuantity, req.body.size);
        })
        .then(result => {
            let totalPrice = 0;
            let quantity = 0;
            const options = {
                path: 'cart.items.productId'
            };
            user.populate(options).then(user => {
                const products = user.cart.items;
                products.map(prod => {
                    totalPrice += +prod.productId.price * +prod.quantity;
                    quantity += prod.quantity;
                })
                return {totalPrice: totalPrice, quantity: quantity};
            }).then(cart => {
                return res.status(201).json({
                    success: true,
                    message: 'Product added to cart',
                    totalPrice: cart.totalPrice,
                    quantity: cart.quantity
                })
            })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

module.exports.postMultipleToCart = async (req, res, next) => {
    const user = await User.findById(req._id);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'No account found with this id'
        })
    }

    const products = [];
    for (let p of req.body.items) {
        await Product.findById(p.productId)
        .then(product => {
            if(product)  {
                products.push(p);
            }
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
    }
    await user.addMultipleToCart(products);
    return res.status(201).json({
        success: true,
        messsage: 'All products added to cart'
    });
};

module.exports.getCart = async (req, res, next) => {
    const user = await User.findById(req._id);
    if(!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        })
    }
    const options = {
        path: 'cart.items.productId'
    };

    user.populate(options).then(user => {
            const products = user.cart.items;
            return res.status(200).json({
                success: true,
                message: 'Cart fetched successfully!',
                products: products
            })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

module.exports.postCartDeleteProduct = async (req, res, next) => {
    const prodId = req.body.productId;
    const user = await User.findById(req._id);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        })
    }
    user.removeFromCart(prodId)
        .then(result => {
            return res.status(201).json({
                success: true,
                message: 'Cart Updated'
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

module.exports.ResetPassword = async (req, res) => {
    if (!req.body.email) {
        return res.status(500).json({
            message: 'Email is required'
        });
    }
    const user = await User.findOne({
        email: req.body.email
    });
    if (!user) {
        return res.status(409).json({
            message: 'Email does not exist'
        });
    }
    // let resettoken = new passwordResetToken({
    //     _userId: user._id,
    //     resettoken: crypto.randomBytes(16).toString('hex')
    // });
    user.resettoken = crypto.randomBytes(16).toString('hex')
    user.save(function (err) {
        if (err) {
            return res.status(500).send({
                msg: err.message
            });
        }

        User.find({
            _id: user._id,
            resettoken: {
                $ne: user.resettoken
            }
        }).deleteOne().exec();
       
        const transporter = nodemailer.createTransport({
            host: 'mail.dopedigital.in',
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAILER_AUTH_EMAIL || devEnv.MAILER_AUTH_EMAIL,
                pass: process.env.MAILER_AUTH_PASS || devEnv.MAILER_AUTH_PASS
            }
        });
        console.log(user.email)
        // const resetLink = "<a href='" + req.body.domain + "/employee/response-reset-password/'><span>link</span></a>.<br>This is a <b>test</b> email."
        let mailOptions = {
            to: user.email,
            from: process.env.ADMIN_EMAIL|| devEnv.MAILER_AUTH_EMAIL,
            subject: 'Gre8 Password Reset',
            html: `
                <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
                <p>Please click on the following link to complete the process.</p>
                <div style="background-color:#3f51b5; color:white;
                padding:24px 2px; max-width: 50%; text-align:center">
                <a style="color:white; text-decoration:none;" href="https://localhost:4200/auth/response-reset-password/${user.resettoken}">RESET PASSWORD</a></div>
                
                <p>'If you did not request this, please ignore this email and your password will remain unchanged.</p>
            `,
        }
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
                return res.send({
                    error: err
                })
            } else {
                console.log('Email sent: ' + info.response);
                return res.send({
                    res: info.response,
                    message: 'E-mail sent successfully'
                })
            }
        })
    })
}

module.exports.ValidPasswordToken = async (req, res) => {
    if (!req.body.resettoken) {
        return res
            .status(500)
            .json({
                message: 'Token is required'
            });
    }
    const user = await User.findOne({
        resettoken: req.body.resettoken
    });
    if (!user) {
        return res
            .status(409)
            .json({
                message: 'Invalid URL'
            });
    }
    User.findOne({
        _id: user._id
    }).then(() => {
        res.status(200).json({
            message: 'Token verified successfully.'
        });
    }).catch((err) => {
        console.log(err)
        return res.status(500).send({
            msg: err.message
        });
    });
}

module.exports.NewPassword = async (req, res) => {
    User.findOne({
        resettoken: req.body.resettoken
    }, function (err, user, next) {
        if (!user) {
            return res
                .status(409)
                .json({
                    message: 'User does not exist'
                });
        } else if (!user.resettoken) {
            return res
                .status(409)
                .json({
                    message: 'Token has expired'
                });
        }
        if (req.body.newPassword !== req.body.confirmPassword) {
            return res.status(401).json({
                success: false,
                message: 'Paswords do no match'
            });
        }

        user.passwordHash = User.hashPassword(req.body.newPassword);
        user.resettoken = null;
        user.save(function (err) {
            if (err) {
                return res
                    .status(400)
                    .json({
                        message: 'Password can not reset.'
                    });
            } else {
                user.resettoken = null;
                return res
                    .status(201)
                    .json({
                        message: 'Password reset successfully'
                    });
            }
        });
    })
}

// User Wishlist methods
module.exports.postWishlist = async (req, res, next) => {
    const user = await User.findById(req._id);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'No account found with this id'
        })
    }
    const prodId = req.body.productId;
    const quantity = req.body.quantity;
    Product.findById(prodId)
        .then(product => {
            return user.addToWishlist(product, quantity, req.body.increaseQuantity, req.body.size);
        })
        .then(result => {
            let totalPrice = 0;
            let quantity = 0;
            const options = {
                path: 'wishlist.items.productId'
            };
            user.populate(options).then(user => {
                const products = user.wishlist.items;
                products.map(prod => {
                    totalPrice += +prod.productId.price * +prod.quantity;
                    quantity += prod.quantity;
                })
                return {totalPrice: totalPrice, quantity: quantity};
            }).then(wishlist => {
                return res.status(201).json({
                    success: true,
                    message: 'Product added to wishlist',
                    totalPrice: wishlist.totalPrice,
                    quantity: wishlist.quantity
                })
            })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

module.exports.postMultipleToWishlist = async (req, res, next) => {
    const user = await User.findById(req._id);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'No account found with this id'
        })
    }

    const products = [];
    for (let p of req.body.items) {
        await Product.findById(p.productId)
        .then(product => {
            if(product)  {
                products.push(p);
            }
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
    }
    await user.addMultipleToWishlist(products);
    return res.status(201).json({
        success: true,
        messsage: 'All products added to wishlist'
    });
};

module.exports.getWishlist = async (req, res, next) => {
    const user = await User.findById(req._id);
    if(!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        })
    }
    const options = {
        path: 'wishlist.items.productId'
    };

    user.populate(options).then(user => {
            const products = user.wishlist.items;
            return res.status(200).json({
                success: true,
                message: 'Wishlist fetched successfully!',
                products: products
            })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

module.exports.postWishlistDeleteProduct = async (req, res, next) => {
    const prodId = req.body.productId;
    const user = await User.findById(req._id);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        })
    }
    user.removeFromWishlist(prodId)
        .then(result => {
            return res.status(201).json({
                success: true,
                message: 'Wishlist Updated'
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};