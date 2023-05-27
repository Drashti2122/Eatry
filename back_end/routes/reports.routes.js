const express = require("express");
const reportController = require("../controllers/reports.controller");
const protectController = require("../controllers/protect.controller");
const router = express.Router();

router.get('/', protectController.protect, reportController.bestSellingItemList)

router
    .route('/topMost/:topMost')
    .get(protectController.protect, reportController.topMostReport)

router.get('/:topMost', protectController.protect, reportController.dailyReports)

module.exports = router;