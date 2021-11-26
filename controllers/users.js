const User = require("../models/user");

module.exports.renderRegister = function (req, res) {
    res.render("users/register");
};

module.exports.registerUser = async function (req, res, next) {
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
};

module.exports.renderLogin = function (req, res) {
    res.render("users/login");
};

module.exports.loginUser = async function (req, res) {
    req.flash("success", "Welcome back!");
    const redirectUrl = req.session.returnTo || "/campgrounds";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.logoutUser = function (req, res) {
    req.logout();
    req.flash("success", "Goodbye!");
    res.redirect("/campgrounds");
};
