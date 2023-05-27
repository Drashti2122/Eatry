
const express = require("express");
const likeController = require("../controllers/like.controller");
const protectController = require("../controllers/protect.controller");
const router = express.Router();

router
    .route('/')
    .post(protectController.protect, likeController.addLikes)

router
    .route('/getFilterData/:data')
    .get(protectController.protect, likeController.searchFilter);

module.exports = router;