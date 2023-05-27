const express = require("express");
const dashPanelController = require("../controllers/dash-panel.controller");
const protectController = require("../controllers/protect.controller");
const router = express.Router();

router
    .route('/:data')
    .get(protectController.protect, dashPanelController.getTotal);

module.exports = router;