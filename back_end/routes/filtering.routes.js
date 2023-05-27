const express = require('express')
const filteringController = require("../controllers/filtering.controller");
const protectController = require("../controllers/protect.controller");
const router = express.Router();

router
    .route('/getFilterData/:data')
    .get(protectController.protect, filteringController.searchFilter);

module.exports = router;