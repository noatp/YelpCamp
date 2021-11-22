const express = require("express");
const router = express.Router({ mergeParams: true });
const { reviewSchema } = require("../schemas.js");

const Review = require("../models/review");
const Campground = require("../models/campground");

const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");

const validateReview = function (req, res, next) {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const message = error.details
            .map((element) => element.message)
            .join(",");
        throw new ExpressError(message, 400);
    } else {
        next();
    }
};

router.post(
    "/",
    validateReview,
    catchAsync(async function (req, res) {
        const campground = await Campground.findById(req.params.id);
        const review = new Review(req.body.review);
        campground.reviews.push(review);
        await review.save();
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

router.delete(
    "/:reviewId",
    catchAsync(async function (req, res) {
        const { id, reviewId } = req.params;
        await Campground.findByIdAndUpdate(id, { $pull: { review: reviewId } });
        await Review.findByIdAndDelete(req.params.reviewId);
        res.redirect(`/campgrounds/${id}`);
    })
);

module.exports = router;
