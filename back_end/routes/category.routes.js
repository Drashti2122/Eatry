const express = require("express");
const categoryController = require("../controllers/category.controller");
const protectController = require("../controllers/protect.controller");
const router = express.Router();

router
    .route('/')
    .post(protectController.protect, categoryController.addCategory)
    .get(protectController.protect, categoryController.getCategory);

router
    .route('/totalCategoryData')
    .get(protectController.protect, categoryController.getTotalCategoryData);

router
    .route('/:id')
    .get(protectController.protect, categoryController.getCategoryById)
    .delete(protectController.protect, categoryController.deleteCategory)
    .patch(protectController.protect, categoryController.editCategory);

module.exports = router;