const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware");
const router = express.Router({ mergeParams: true });
const reviewController = require("../controller/review");

router.route("/")
    //Reviews add route
    .post(isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

router.route("/:rid")
    //review delete route
    .delete(isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;