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
    catchAsync(async function (req, res, next) {
        try {
            const { email, username, password } = req.body;
            const user = new User({ email, username });
            const registeredUser = await User.register(user, password);
            req.login(registeredUser, function (error) {
                if (error) {
                    return next(error);
                }
                req.flash("Welcome to YelpCamp");
                res.redirect("/campgrounds");
            });
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
        const redirectUrl = req.session.returnTo || "/campgrounds";
        delete req.session.returnTo;
        res.redirect(redirectUrl);
    }
);

router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "Goodbye!");
    res.redirect("/campgrounds");
});

module.exports = router;
