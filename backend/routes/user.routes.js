const express = require("express");
const userController = require("../controllers/user.controller");
const protectController = require("../controllers/protect.controller");

const router = express.Router();
router.get('/', protectController.protect, userController.getAllUser)
router.post('/signUp', userController.signUp)
router.post('/signIn', userController.signIn)

router.post('/forgotPassword', userController.forgotPassword)
router.patch('/resetPassword/:token', userController.resetPassword)
module.exports = router;