const express = require("express");
const router = express.Router({ mergeParams: true });

const Review = require("../models/review");
const Campground = require("../models/campground");

const catchAsync = require("../utils/catchAsync");

const reviews = require("../controllers/reviews");

const {
    validateReview,
    isLoggedIn,
    isAuthorOfReview,
} = require("../middleware");

router.post("/", isLoggedIn, validateReview, catchAsync(reviews.newReview));

router.delete(
    "/:reviewId",
    isLoggedIn,
    isAuthorOfReview,
    catchAsync(reviews.deleteReview)
);

module.exports = router;
