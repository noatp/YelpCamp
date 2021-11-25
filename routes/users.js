const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");

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
module.exports = router;
