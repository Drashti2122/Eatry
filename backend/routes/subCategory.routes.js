const express = require("express");
const subCategoryController = require("../controllers/subCategory.controller");
const adminController = require("../controllers/protect.controller");
const router = express.Router();

router
    .route('/')
    .post(adminController.protect, subCategoryController.addSubCategory)
    .get(adminController.protect, subCategoryController.getSubCategory);

router
    .route('/:id')
    .get(adminController.protect, subCategoryController.getSubCategoryById)
    .delete(adminController.protect, subCategoryController.deleteSubCategory)
    .patch(adminController.protect, subCategoryController.editSubCategory);

module.exports = router;