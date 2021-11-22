//const { createSecretKey } = require("crypto");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const Campground = require("./models/campground");
const campground = require("./models/campground");
const ejsMate = require("ejs-mate");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const Joi = require("joi");
const Review = require("./models/review");

const campgrounds = require("./routes/campgrounds");
// const { resourceLimits } = require("worker_threads");
// const { valid } = require("joi");
const { campgroundSchema, reviewSchema } = require("./schemas.js");
const { required } = require("joi");

const app = express();

mongoose
    .connect("mongodb://localhost:27017/yelpCamp", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(function () {
        console.log("Connected to db successfully");
    })
    .catch(function (error) {
        console.log("Could not connect to db");
        console.log(error);
    });

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

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

app.use("/campgrounds", campgrounds);

app.get("/", function (req, res) {
    res.render("home.ejs");
});

app.post(
    "/campgrounds/:id/reviews",
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

app.delete(
    "/campgrounds/:id/reviews/:reviewId",
    catchAsync(async function (req, res) {
        const { id, reviewId } = req.params;
        await Campground.findByIdAndUpdate(id, { $pull: { review: reviewId } });
        await Review.findByIdAndDelete(req.params.reviewId);
        res.redirect(`/campgrounds/${id}`);
    })
);

app.all("*", function (req, res, next) {
    next(new ExpressError("Page Not Found", 404));
});

app.use(function (err, req, res, next) {
    const { statusCode = 500 } = err;
    if (!err.message) {
        err.message = "Something went wrong!";
    }
    res.status(statusCode).render("error", { err });
});

app.listen(3000, function () {
    console.log("Listening on port 3000");
});
