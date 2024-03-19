const express = require('express');
const router = express.Router();

const ctrlContactDetails = require('../controllers/contact-details.controller');

router.get('/get-contact-details', ctrlContactDetails.getContactDetails);
router.post('/post-contact-details', ctrlContactDetails.postContactDetails);

module.exports = router;