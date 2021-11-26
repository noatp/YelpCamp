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

router
    .route("/")
    .get(catchAsync(campgrounds.index))
    .post(
        isLoggedIn,
        validateCampground,
        catchAsync(campgrounds.createCampground)
    );

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router
    .route("/:id")
    .get(catchAsync(campgrounds.showCampground))
    .put(
        isLoggedIn,
        isAuthorOfCampground,
        validateCampground,
        catchAsync(campgrounds.updateCampground)
    )
    .delete(
        isLoggedIn,
        isAuthorOfCampground,
        catchAsync(campgrounds.deleteCampground)
    );

//update by id
router.get(
    "/:id/edit",
    isLoggedIn,
    isAuthorOfCampground,
    catchAsync(campgrounds.renderEditForm)
);

module.exports = router;
