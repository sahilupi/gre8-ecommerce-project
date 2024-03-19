const express = require('express');
const router = express.Router();

const ctrlProduct = require('../controllers/product.controller');
const extractFile = require("../middlewares/file");

router.get('/get-products', ctrlProduct.getProducts);
router.get('/get-products-count', ctrlProduct.getProductsCount);
router.get('/get-featured-products/:count/:sort', ctrlProduct.getFeaturedProducts);
router.get('/get-product/:id', ctrlProduct.getProduct);
router.post('/post-product', extractFile.single('image'), ctrlProduct.postProduct);
router.put('/update-product/:id', extractFile.single('image'), ctrlProduct.updateProduct);
router.put('/update-product-gallery/:id', extractFile.array('images', 20), ctrlProduct.updateProductGallery);
router.delete('/delete-product/:id', ctrlProduct.deleteProduct);

module.exports = router;