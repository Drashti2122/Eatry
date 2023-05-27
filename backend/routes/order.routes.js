const express = require("express");
const orderController = require("../controllers/order.controller");
const protectController = require("../controllers/protect.controller");
const router = express.Router();

router
    .route('/')
    .post(protectController.protect, orderController.addOrder)
    .get(protectController.protect, orderController.getOrder);

router
    .route('/getOrderUser')
    .get(protectController.protect, orderController.getOrderUser)

router.get('/orderExists', protectController.protect, orderController.orderExists)

router
    .route('/chkOrder')
    .get(protectController.protect, orderController.checkOrderExists)

router
    .route('/searchFilter/:data')
    .get(protectController.protect, orderController.searchFilter)

router
    .route('/:status')
    .get(orderController.getOrder);

router
    .route('/:id')
    .patch(protectController.protect, orderController.updateStatus)

// router.post('/sentFirebaseToken', adminController.firebaseToken);
module.exports = router;