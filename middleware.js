const { campgroundSchema, reviewSchema } = require("./schemas.js");
const ExpressError = require("./utils/ExpressError");
const Campground = require("./models/campground");
const Review = require("./models/review");

module.exports.isLoggedIn = function (req, res, next) {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You must sign in first!");
        return res.redirect("/login");
    }
    next();
};

module.exports.validateCampground = function (req, res, next) {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const message = error.details
            .map((element) => element.message)
            .join(",");
        throw new ExpressError(message, 400);
    } else {
        next();
    }
};

module.exports.isAuthorOfCampground = async function (req, res, next) {
    const campground = await Campground.findById(req.params.id);
    if (!campground.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/campgrounds/${campground._id}`);
    }
    next();
};

module.exports.isAuthorOfReview = async function (req, res, next) {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};

module.exports.validateReview = function (req, res, next) {
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
