const mongoose = require('mongoose');
const Product = mongoose.model('Product');;

const devEnv = require('../dev-env/dev-env');
const Order = mongoose.model('Order');
const OrderItem = mongoose.model('OrderItem');
const User = mongoose.model('User');
const Razorpay = require('razorpay');
const nodemailer = require('nodemailer');
const stripe = require('stripe')(process.env.STRIPE_SECRET || devEnv.STRIPE_SECRET);

let instance = new Razorpay({
    key_id: process.env.KEY_ID || devEnv.LOCAL_key_id,
    key_secret: process.env.KEY_SECRET || devEnv.LOCAL_key_secret,
});

const sendOrderMail = (user, order, domain) => {
    const transporter = nodemailer.createTransport({
        host: process.env.MAILER_AUTH_HOST || devEnv.MAILER_AUTH_HOST,
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAILER_AUTH_EMAIL || devEnv.MAILER_AUTH_EMAIL,
            pass: process.env.MAILER_AUTH_PASS || devEnv.MAILER_AUTH_PASS
        }
    });

    const mailOptions = {
        from: `${user.name} <${user.email}>`,
        to: process.env.MAIL_RECIEVER || devEnv.MAIL_RECIEVER,
        subject: `Order on www.gre8.in`,
        html: `<h2>Order from ${user.name} </h2> 
            <h3> Order Id:  <strong>${order._id}</strong></h3>
        <div style="background-color:#3f51b5; color:white;padding:24px 2px; max-width: 50%; text-align:center">
        <a style="color:white; text-decoration:none;" href="${domain}/orders/detail/${order._id}">VIEW ORDER</a></div>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.send({
                error: error
            })
        } else {
            console.log('Email sent: ' + info.response);
            res.send({
                res: info.response,
                message: 'E-mail sent successfully'
            })
        }
    });
}

const sendOrderStatusMail = (order, status) => {
    const transporter = nodemailer.createTransport({
        host: process.env.MAILER_AUTH_HOST || devEnv.MAILER_AUTH_HOST,
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAILER_AUTH_EMAIL || devEnv.MAILER_AUTH_EMAIL,
            pass: process.env.MAILER_AUTH_PASS || devEnv.MAILER_AUTH_PASS
        }
    });

    const mailOptions = {
        from: `Gre8 <${process.env.MAILER_AUTH_EMAIL || devEnv.MAILER_AUTH_EMAIL}`,
        to: `${order.address.email}`,
        subject: `Order on www.gre8.in`,
        html: `<h2>Hello, ${order.address.name} </h2>
            <h3> Your order with Id: <strong>${order._id}</strong> is <span style="color:green">${status}</span></h3>
        <div style="background-color:#3f51b5; color:white;padding:24px 2px; max-width: 50%; text-align:center">
        <a style="color:white; text-decoration:none;" href="https://www.gre8.in/user/orders/order/${order._id}">VIEW ORDER</a></div>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.send({
                error: error
            })
        } else {
            console.log('Email sent: ' + info.response);
            res.send({
                res: info.response,
                message: 'E-mail sent successfully'
            })
        }
    });
}

module.exports.getOrders = (req, res, next) => {
    try {
        Order.find().populate('user', 'name email').sort({
            'dateOrdered': -1
        }).then(orders => {
            if (!orders || orders.length < 1) {
                return res.status(404).json({
                    success: false,
                    message: 'No orders found.'
                });
            } else {
                return res.status(200).json({
                    success: true,
                    orders: orders
                });
            }
        }).catch(err => {
            console.log(err)
            return next(err);
        })
    } catch (err) {
        return next(err);
    }
};

module.exports.getTotalSales = (req, res, next) => {
    try {
        Order.find().select('totalPrice').then(orders => {
            if (!orders || orders.length < 1) {
                return res.status(404).json({
                    success: false,
                    message: 'No orders found.'
                });
            } else {
                let totalSales = 0
                orders.reduce((acc, curr) => {
                    totalSales += curr.totalPrice;
                }, 0);
                return res.status(200).json({
                    success: true,
                    totalSales: totalSales
                });
            }
        }).catch(err => {
            return next(err);
        })
    } catch (err) {
        return next(err);
    }
};

module.exports.getOrderCount = (req, res, next) => {
    try {
        Order.countDocuments().then(orderCount => {
            if (!orderCount || orderCount.length < 1) {
                return res.status(404).json({
                    success: false,
                    message: 'No Orders found.'
                });
            } else {
                return res.status(200).json({
                    success: true,
                    orderCount: orderCount
                });
            }
        }).catch(err => {
            return next(err);
        })
    } catch (err) {
        return next(err);
    }
};

module.exports.getUserOrders = (req, res, next) => {
    try {
        Order.find({
            user: req._id
        }).populate({
            path: 'orderItems'
        }).sort({
            'dateOrdered': -1
        }).then(userOrders => {
            if (!userOrders || userOrders.length < 1) {
                return res.status(404).json({
                    success: false,
                    message: 'No orders found.'
                });
            } else {
                return res.status(200).json({
                    success: true,
                    orders: userOrders
                });
            }
        }).catch(err => {
            return next(err);
        })
    } catch (err) {
        return next(err);
    }
};

module.exports.getOrder = (req, res, next) => {
    try {
        Order.findById(req.params.id)
            .populate('user', 'name email')
            .populate({
                path: 'orderItems',
                populate: {
                    path: 'product'
                }
            })
            .then(order => {
                if (!order || order.length < 1) {
                    return res.status(404).json({
                        success: false,
                        message: 'No order found.'
                    });
                } else {
                    return res.status(200).json({
                        success: true,
                        order: order
                    });
                }
            }).catch(err => {
                return next(err);
            })
    } catch (err) {
        return next(err);
    }
};

module.exports.postOrder = async (req, res, next) => {
    try {
        const user = await User.findById(req._id);
        const orderItemIds = Promise.all(req.body.orderItems.map(orderItem => {
            let newOrderItem = new OrderItem({
                product: orderItem.productId,
                quantity: orderItem.quantity
            });
            // newOrderItem = await newOrderItem.save();
            // return newOrderItem._id
            return newOrderItem.save().then(saveOrderItem => {
                if (!saveOrderItem) {
                    return res.status(503).send({
                        success: false,
                        message: 'Order Items can\'t be saved! Please try again.'
                    });
                }
                return saveOrderItem._id;
            }).catch(err => {
                return next(err);
            });
        }));

        const orderItemIdsResolved = await orderItemIds;

        const totalPrices = await Promise.all(orderItemIdsResolved.map(async orderItemId => {
            const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price currency');
            const totalPrice = orderItem.product.price * orderItem.quantity;
            // const currency = orderItem.product.currency
            return totalPrice;
        }));


        // const totalPrice = totalPrices.map(resObj => {
        //     const totalPr =+ resObj.totalPrice
        //     return totalPr;
        // })
        // const finalTotalPrice = totalPrice.reduce((a, b) => a + b, 0);
        // const currency = totalPrices.map(resObj => {
        //     return resObj.currency;
        // });

        const totalPrice = totalPrices.reduce((a, b) => a + b, 0);
        otp = generateOTP(8);

        const order = new Order({
            orderItems: orderItemIdsResolved,
            address: {
                shippingAddress1: req.body.address.shippingAddress1,
                shippingAddress2: req.body.address.shippingAddress2,
                city: req.body.address.city,
                zip: req.body.address.zip,
                country: req.body.address.country,
                phone: req.body.address.phone
            },
            totalPrice: totalPrice,
            user: req._id ? req._id : req.body.userId,
            paymentStatus: 'Pending',
            orderSessionId: req.body.sessionId
        });

        order.save().then((savedOrder) => {
            if (!savedOrder) {
                return res.status(503).send({
                    success: false,
                    message: 'Order can not be placed! Please try again.'
                });
            }
            return res.status(201).send({
                success: true,
                message: 'Order placed succussfully!'
            });
        }).catch(err => {
            return next(err);
        })
    } catch (err) {
        return next(err);
    }
};

module.exports.createOrderSession = async (req, res, next) => {
    const orderItems = req.body.orderBody.orderItems;
    if (!orderItems) {
        return res.status(400).json({
            success: false,
            message: 'Please check your order items'
        })
    }

    const lineItems = await Promise.all(
        orderItems.map(async (orderItem) => {
            const product = await Product.findById(orderItem.productId._id);
            return {
                price_data: {
                    currency: 'INR',
                    product_data: {
                        name: product.name,
                    },
                    unit_amount: +product.price * 100
                },
                quantity: +orderItem.quantity
            }
        })
    );

    const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        payment_method_types: ['card'],
        mode: 'payment',
        success_url: req.body.domain + '/success?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: req.body.domain + '/cart',
    });
    return res.status(200).json({
        success: true,
        message: 'Creating order',
        sessionId: session.id
    });
}

module.exports.confirmOrder = async (req, res, next) => {
    try {
        const user = await User.findById(req._id);

        const order = await Order.findOne({
            orderSessionId: req.body.orderSessionId
        });

        if (!order || !user) {
            return res.status(404).json({
                success: false,
                message: 'Order id or User not found'
            })
        }

        order.paymentStatus = "Success";

        order.save().then((savedOrder) => {
            if (!savedOrder) {
                return res.status(503).send({
                    success: false,
                    message: 'Order can not be placed! Please try again.'
                });
            }
            return user.clearCart();
        }).then(() => {
            return res.status(201).send({
                success: true,
                message: 'Order placed succussfully!'
            });
        }).catch(err => {
            return next(err);
        })
    } catch (err) {
        return next(err);
    }
};

module.exports.updateOrderStatus = (req, res, next) => {
    try {
        Order.findByIdAndUpdate(req.params.id).then((founededOrder) => {
            if (!founededOrder) {
                return res.status(404).send({
                    success: false,
                    message: 'Category not found!'
                });
            } else {
                founededOrder.status = req.body.status;
            };

            founededOrder.save().then((savedOrder) => {
                if (!savedOrder) {
                    return res.status(503).send({
                        success: false,
                        message: 'Order status can not be updated! Please try again.'
                    });
                }
                sendOrderStatusMail(savedOrder, req.body.status);
                return res.status(201).send({
                    success: true,
                    message: 'Order status updated!',
                    order: savedOrder
                });
            }).catch(err => {
                return next(err);
            })
        }).catch(err => {
            return next(err);
        })
    } catch (err) {
        return next(err);
    }
};

module.exports.deleteOrder = (req, res, next) => {
    try {
        Order.findByIdAndRemove(req.params.id).then(async order => {
            if (!order) {
                return res.status(404).send({
                    success: false,
                    message: 'Order not found!'
                });
            };
            await order.orderItems.map(async orderItem => {
                await OrderItem.findByIdAndRemove(orderItem);
            });
            return res.status(201).send({
                success: true,
                message: 'Order deleted succussfully!'
            });
        }).catch(err => {
            return next(err);
        });
    } catch (err) {
        return next(err);
    };
};

module.exports.postCreateOrder = async (req, res, next) => {
    try {
        const user = await User.findById(req._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }
        const options = {
            path: 'cart.items.productId'
        };
        let totalSum = 0;

        user.populate(options).then(user => {
                const products = user.cart.items;
                products.forEach(p => {
                    totalSum += +p.quantity * +p.productId.currentPrice;
                });
                if(+totalSum <=600) {
                    totalSum = totalSum+120
                }
                let optionsRazorpay = {
                    amount: +totalSum * 100, // amount in the smallest currency unit
                    currency: 'INR',
                    payment_capture: +totalSum * 100
                };
                instance.orders.create(optionsRazorpay, (err, order) => {
                    if (err) {
                        return next(err);
                    }
                    if (order) {
                        return res.status(200).send({
                            success: true,
                            message: 'Creating order',
                            orderId: order.id,
                            value: order,
                            userId: req._id,
                            key: process.env.KEY_ID || devEnv.LOCAL_key_id
                        });
                    }
                });
            })
            .catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            });
    } catch (err) {
        return next(err);
    }
}

module.exports.postOrderResponse = async (req, res, next) => {
    try {
        const currentUser = await User.findById(req._id || req.body.userId);

        const options = {
            path: 'cart.items.productId'
        };
        let totalSum = 0;

        currentUser.populate(options).then(user => {
                const products = user.cart.items;
                return Promise.all(products.map(orderItem => {
                    totalSum += +orderItem.quantity * +orderItem.productId.currentPrice;
                    let newOrderItem;
                    if (orderItem.size) {
                        newOrderItem = new OrderItem({
                            product: orderItem.productId,
                            quantity: orderItem.quantity,
                            size: orderItem.size
                        });
                    }
                    else {
                        newOrderItem = new OrderItem({
                            product: orderItem.productId,
                            quantity: orderItem.quantity
                        });
                    }
                    
                    return newOrderItem.save().then(saveOrderItem => {
                        if (!saveOrderItem) {
                            return res.status(503).send({
                                success: false,
                                message: 'Order Items can\'t be saved! Please try again.'
                            });
                        }
                        return saveOrderItem._id;
                    })
                }));
            }).then(orderItemIdsResolved => {
                const order = new Order({
                    orderItems: orderItemIdsResolved,
                    address: {
                        shippingAddress1: req.body.address1,
                        shippingAddress2: req.body.apartment,
                        city: req.body.city,
                        zip: req.body.postalCode,
                        country: req.body.country,
                        phone: req.body.phone,
                        email: req.body.email,
                        name: req.body.name,
                        orderNotes: req.body.orderNotes
                    },
                    totalPrice: totalSum,
                    user: req._id ? req._id : req.body.userId,
                    paymentStatus: 'Success',
                    orderSessionId: req.body.sessionId
                });

                order.save().then((savedOrder) => {
                    if (!savedOrder) {
                        return res.status(503).send({
                            success: false,
                            message: 'Order can not be placed! Please try again.'
                        });
                    }
                    const domain = process.env.DASHBOARD_DOMAIN || devEnv.DASHBOARD_DOMAIN;
                    sendOrderMail(currentUser, savedOrder, domain);
                    return currentUser.clearCart();
                }).then(() => {
                    return res.status(201).send({
                        success: true,
                        message: 'Order placed succussfully!'
                    });
                }).catch(err => {
                    return next(err);
                })
            })
            .catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            });
    } catch (err) {
        return next(err);
    }
}

// order example 

// {
//     "orderItems": [
//         {
//             "quantity": 3,
//             "productId": "63f21a57de1e5160ff23a9cc"
//         },
//         {
//             "quantity": 2,
//             "product": "63f21ba24bd1593b2ca48add"
//         }
//     ],
//     "shippingAddress1": "Address 1",
//     "shippingAddress2": "Address 2",
//     "city": "Mohali",
//     "zip": "123456",
//     "country": "India",
//     "phone": "9898989898"
//     "user": "63f24bde043f5acaf6b8bb27"
// }