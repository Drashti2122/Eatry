const express = require("express");
const paymentController = require("../controllers/payment.controller");
const protectController = require("../controllers/protect.controller");
const router = express.Router();

router
    .route('/')
    .post(protectController.protect, paymentController.addPayment)

router.post("/refundTable", protectController.protect, paymentController.refundTable)

router.post('/payTable', protectController.protect, paymentController.addPaymentTable)
module.exports = router;