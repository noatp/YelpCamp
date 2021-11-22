const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const { campgroundSchema } = require("../schemas.js");

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

router.get(
    "/",
    catchAsync(async function (req, res) {
        const campgrounds = await Campground.find({});
        res.render("campgrounds/index", { campgrounds });
    })
);

router.get("/new", function (req, res) {
    res.render("campgrounds/new");
});

router.post(
    "/",
    validateCampground,
    catchAsync(async function (req, res, next) {
        const campground = new Campground(req.body.campground);
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

router.get(
    "/:id",
    catchAsync(async function (req, res) {
        const campground = await Campground.findById(req.params.id).populate(
            "reviews"
        );
        res.render("campgrounds/show", { campground });
    })
);

//update by id
router.get(
    "/:id/edit",
    catchAsync(async function (req, res) {
        const campground = await Campground.findById(req.params.id);
        res.render("campgrounds/edit", { campground });
    })
);

router.put(
    "/:id",
    validateCampground,
    catchAsync(async function (req, res) {
        const campground = await Campground.findByIdAndUpdate(req.params.id, {
            ...req.body.campground,
        });
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

//delete by id
router.delete(
    "/:id",
    catchAsync(async function (req, res) {
        await Campground.findByIdAndDelete(req.params.id);
        res.redirect("/campgrounds");
    })
);

module.exports = router;
