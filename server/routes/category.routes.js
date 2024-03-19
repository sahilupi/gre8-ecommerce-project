const express = require('express');
const router = express.Router();

const ctrlCategory = require('../controllers/category.controller');

router.get('/get-categories', ctrlCategory.getCategories);
router.get('/get-category/:id', ctrlCategory.getCategory);
router.post('/post-category', ctrlCategory.postCategory);
router.delete('/delete-category/:id', ctrlCategory.deleteCategory);
router.put('/update-category/:id', ctrlCategory.updateCategory);

module.exports = router;