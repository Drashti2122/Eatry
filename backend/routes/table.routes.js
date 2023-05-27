const express = require("express");
const tableController = require("../controllers/table.controller");
const adminController = require("../controllers/protect.controller");
const router = express.Router();

router
    .route('/')
    .post(adminController.protect, tableController.addTable)
    .get(adminController.protect, tableController.getTable);

router
    .route('/:id')
    .get(adminController.protect, tableController.getTableById)
    .delete(adminController.protect, tableController.deleteTable)
    .patch(adminController.protect, tableController.editTable);

router
    .route('/editTableStatus/:id')
    .get(adminController.protect, tableController.editTableStatus)

router
    .route('/getTableId/:id')
    .get(tableController.getTableId)

module.exports = router;