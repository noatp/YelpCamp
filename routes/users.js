const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");

router.get("/register", function (req, res) {
    res.render("users/register");
});

router.post(
    "/register",
    catchAsync(async function (req, res) {
        try {
            const { email, username, password } = req.body;
            const user = new User({ email, username });
            const registeredUser = await User.register(user, password);
            console.log(registeredUser);
            req.flash("Welcome to YelpCamp");
            res.redirect("/campgrounds");
        } catch (error) {
            req.flash("error", error.message);
            res.redirect("/register");
        }
    })
);

router.get("/login", function (req, res) {
    res.render("users/login");
});

router.post(
    "/login",
    passport.authenticate("local", {
        failureFlash: true,
        failureRedirect: "/login",
    }),
    async function (req, res) {
        req.flash("success", "Welcome back!");
        res.redirect("/campgrounds");
    }
);

module.exports = router;
