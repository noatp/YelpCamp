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
// const { resourceLimits } = require("worker_threads");
// const { valid } = require("joi");
const { campgroundSchema } = require("./schemas.js");

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

const validateCampground = function (req, res, next) {
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

app.get("/", function (req, res) {
    res.render("home.ejs");
});

app.get(
    "/campgrounds",
    catchAsync(async function (req, res) {
        const campgrounds = await Campground.find({});
        res.render("campgrounds/index", { campgrounds });
    })
);

app.get("/campgrounds/new", function (req, res) {
    res.render("campgrounds/new");
});

app.post(
    "/campgrounds",
    validateCampground,
    catchAsync(async function (req, res, next) {
        const campground = new Campground(req.body.campground);
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

app.get(
    "/campgrounds/:id",
    catchAsync(async function (req, res) {
        const campground = await Campground.findById(req.params.id);
        res.render("campgrounds/show", { campground });
    })
);

//update by id
app.get(
    "/campgrounds/:id/edit",
    catchAsync(async function (req, res) {
        const campground = await Campground.findById(req.params.id);
        res.render("campgrounds/edit", { campground });
    })
);

app.put(
    "/campgrounds/:id",
    validateCampground,
    catchAsync(async function (req, res) {
        const campground = await Campground.findByIdAndUpdate(req.params.id, {
            ...req.body.campground,
        });
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

//delete by id
app.delete(
    "/campgrounds/:id",
    catchAsync(async function (req, res) {
        await Campground.findByIdAndDelete(req.params.id);
        res.redirect("/campgrounds");
    })
);

app.post(
    "/campgrounds/:id/reviews",
    catchAsync(async function (req, res) {
        const campground = await Campground.findById(req.params.id);
        const review = new Review(req.body.review);
        campground.reviews.push(review);
        await review.save();
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`);
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
