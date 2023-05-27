const express = require("express");
const itemController = require("../controllers/item.controller");
const adminController = require("../controllers/protect.controller");
const router = express.Router();

router
    .route('/')
    .post(adminController.protect, itemController.addItem)
    .get(adminController.protect, itemController.getItem);

router
    .route('/getItems')
    .get(itemController.getItems);

router
    .route('/:id')
    .get(adminController.protect, itemController.getItemById)
    .delete(adminController.protect, itemController.deleteItem)
    .patch(adminController.protect, itemController.editItem);

module.exports = router;