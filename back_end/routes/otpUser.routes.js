const express = require("express");
const otpUserController = require("../controllers/otpUser.controller");
const protectController = require("../controllers/protect.controller")
const router = express.Router();

router.post('/sendEmail', otpUserController.sendEmailForOtp)
router.post('/matchOTP', otpUserController.matchOTP)
router.post('/getOtpUsers', otpUserController.getOtpUsers)
router.post('/checkExists', otpUserController.checkExists)
router.get('/getCurrentUser', protectController.protect, otpUserController.getCurrentUser)

module.exports = router;