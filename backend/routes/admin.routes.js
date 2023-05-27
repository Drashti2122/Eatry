const express = require("express");
const protectController = require("../controllers/protect.controller");
const adminController = require("../controllers/admin.controller");
const router = express.Router();

router
    .route('/').post(adminController.signIn)

router.post('/deviceToken', adminController.addDeviceToken);

router.post('/forgotPassword', adminController.forgotPassword);
router.patch('/resetPassword/:token', adminController.resetPassword);

// router.patch('/changePassword', adminController.changePassword);

router
    .route('/changePassword')
    .patch(protectController.protect, adminController.changePassword)

router.route('/:email').get(adminController.getAdmin);

module.exports = router;