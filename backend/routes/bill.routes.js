const express = require("express");
const billController = require("../controllers/bill.controller");
const protectController = require("../controllers/protect.controller");
const router = express.Router();

router
    .route('/')
    .post(protectController.protect, billController.addBill)
    .get(protectController.protect, billController.getBill)

router.route('/getStatus').get(protectController.protect, billController.getStatus)
router.route('/upDatebillStatus').patch(protectController.protect, billController.upDateBillStatus)
router.route('/searchFilter/:data').get(protectController.protect, billController.searchFilter)

module.exports = router;