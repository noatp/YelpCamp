const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const {
    isLoggedIn,
    isAuthorOfCampground,
    validateCampground,
} = require("../middleware");

router.get(
    "/",
    catchAsync(async function (req, res) {
        const campgrounds = await Campground.find({});
        res.render("campgrounds/index", { campgrounds });
    })
);

router.get("/new", isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});

router.post(
    "/",
    isLoggedIn,
    validateCampground,
    catchAsync(async function (req, res, next) {
        const campground = new Campground(req.body.campground);
        campground.author = req.user._id;
        await campground.save();
        req.flash("success", "Successfully made a new campground!");
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

router.get(
    "/:id",
    catchAsync(async function (req, res) {
        const campground = await Campground.findById(req.params.id)
            .populate({
                path: "reviews",
                populate: {
                    path: "author",
                },
            })
            .populate("author");
        if (!campground) {
            req.flash("error", "Campground not found!");
            return res.redirect("/campgrounds");
        }
        res.render("campgrounds/show", { campground });
    })
);

//update by id
router.get(
    "/:id/edit",
    isLoggedIn,
    isAuthorOfCampground,
    catchAsync(async function (req, res) {
        const campground = await Campground.findById(req.params.id);
        if (!campground) {
            req.flash("error", "Campground not found!");
            return res.redirect("/campgrounds");
        }
        res.render("campgrounds/edit", { campground });
    })
);

router.put(
    "/:id",
    isLoggedIn,
    isAuthorOfCampground,
    validateCampground,
    catchAsync(async function (req, res) {
        const campground = await Campground.findByIdAndUpdate(req.params.id, {
            ...req.body.campground,
        });
        req.flash("success", "Successfully updated this campground!");
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

//delete by id
router.delete(
    "/:id",
    isLoggedIn,
    isAuthorOfCampground,
    catchAsync(async function (req, res) {
        const campground = await Campground.findById(req.params.id);
        if (!campground) {
            req.flash("error", "Campground not found!");
            return res.redirect("/campgrounds");
        }
        await Campground.findByIdAndDelete(req.params.id);
        req.flash("success", "Successfully removed a campground!");
        res.redirect("/campgrounds");
    })
);

module.exports = router;
