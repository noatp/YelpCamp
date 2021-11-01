const { createSecretKey } = require("crypto");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const Campground = require("./models/campground");
const campground = require("./models/campground");
const ejsMate = require("ejs-mate");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");

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

app.all("*", function (req, res, next) {
    next(new ExpressError("Page Not Found", 404));
});

app.use(function (err, req, res, next) {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).send(message);
});

app.listen(3000, function () {
    console.log("Listening on port 3000");
});
