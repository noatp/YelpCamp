const { createSecretKey } = require("crypto");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const Campground = require("./models/campground");
const campground = require("./models/campground");
const ejsMate = require("ejs-mate");

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

app.get("/campgrounds", async function (req, res) {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
});

app.get("/campgrounds/new", function (req, res) {
    res.render("campgrounds/new");
});

app.post("/campgrounds", async function (req, res) {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
});

app.get("/campgrounds/:id", async function (req, res) {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/show", { campground });
});

app.get("/campgrounds/:id/edit", async function (req, res) {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
});

app.put("/campgrounds/:id", async function (req, res) {
    const campground = await Campground.findByIdAndUpdate(req.params.id, {
        ...req.body.campground,
    });
    res.redirect(`/campgrounds/${campground._id}`);
});

app.delete("/campgrounds/:id", async function (req, res) {
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect("/campgrounds");
});

app.listen(3000, function () {
    console.log("Listening on port 3000");
});
