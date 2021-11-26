const express = require("express");
const router = express.Router({ mergeParams: true });

const Review = require("../models/review");
const Campground = require("../models/campground");

const catchAsync = require("../utils/catchAsync");

const {
    validateReview,
    isLoggedIn,
    isAuthorOfReview,
} = require("../middleware");

router.post(
    "/",
    isLoggedIn,
    validateReview,
    catchAsync(async function (req, res) {
        const campground = await Campground.findById(req.params.id);
        const review = new Review(req.body.review);
        review.author = req.user._id;
        campground.reviews.push(review);
        await review.save();
        await campground.save();
        req.flash("success", "Created a new review!");
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

router.delete(
    "/:reviewId",
    isLoggedIn,
    isAuthorOfReview,
    catchAsync(async function (req, res) {
        const { id, reviewId } = req.params;
        await Campground.findByIdAndUpdate(id, { $pull: { review: reviewId } });
        await Review.findByIdAndDelete(req.params.reviewId);
        req.flash("success", "Removed a review!");
        res.redirect(`/campgrounds/${id}`);
    })
);

module.exports = router;
