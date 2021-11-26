const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const campgrounds = require("../controllers/campgrounds");

const {
    isLoggedIn,
    isAuthorOfCampground,
    validateCampground,
} = require("../middleware");

router.get("/", catchAsync(campgrounds.index));

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router.post(
    "/",
    isLoggedIn,
    validateCampground,
    catchAsync(campgrounds.createCampground)
);

router.get("/:id", catchAsync(campgrounds.showCampground));

//update by id
router.get(
    "/:id/edit",
    isLoggedIn,
    isAuthorOfCampground,
    catchAsync(campgrounds.renderEditForm)
);

router.put(
    "/:id",
    isLoggedIn,
    isAuthorOfCampground,
    validateCampground,
    catchAsync(campgrounds.updateCampground)
);

//delete by id
router.delete(
    "/:id",
    isLoggedIn,
    isAuthorOfCampground,
    catchAsync(campgrounds.deleteCampground)
);

module.exports = router;
