const mongoose = require('mongoose');

const ContactDetail = mongoose.model('ContactDetail');

module.exports.getContactDetails = (req, res, next) => {
    try {
        ContactDetail.find().then(details => {
            if (!details || details.length < 1) {
                return res.status(404).json({
                    success: false,
                    message: 'No Contact details found.'
                });
            } else {
                return res.status(200).json({
                    success: true,
                    details: details
                });
            }
        }).catch(err => {
            console.log(err)
            return next(err);
        })
    } catch (err) {
        return next(err);
    }
}

module.exports.postContactDetails = async (req, res, next) => {
    try {
        let contactDetail = new ContactDetail();
        contactDetail.phone = req.body.phone;
        contactDetail.email = req.body.email;
        contactDetail.socialMediaLinks = {
            facebook: req.body.facebook,
            twitter: req.body.twitter,
            instagram: req.body.instagram
        };
        contactDetail.save().then(() => {
            return res.status(200).send({
                success: true,
                message: 'Details added succussfully!'
            });
        }).catch(err => {
                return next(err);
        })

    } catch (err) {
        return next(err);
    }
}