const express = require("express");
const tableReservationController = require("../controllers/tableReservation.controller");
const adminController = require("../controllers/protect.controller");
const router = express.Router();

router
    .route('/')
    .post(adminController.protect, tableReservationController.addTableReservation)
    .get(adminController.protect, tableReservationController.getTableReservation);

router
    .route('/getTableByUser')
    .get(adminController.protect, tableReservationController.getTableByUser)

router
    .route('/:search')
    .get(adminController.protect, tableReservationController.searchTableReservation)

router
    .route('/searchFilter/:data')
    .get(adminController.protect, tableReservationController.searchTableReservation)

module.exports = router;