const express = require("express");
const notificationController = require('../controllers/notification.controller')
const protectController = require("../controllers/protect.controller");
const router = express.Router();

router
    .route('/')
    // .post(protectController.protect, notificationController.putNotification)
    .get(protectController.protect, notificationController.getNotification)

router
    .route('/:id')
    .delete(protectController.protect, notificationController.delNotification)

router.get('/notificationDetails', protectController.protect, notificationController.getNotificationWithDetails)

module.exports = router;