const Campground = require("../models/campground");

module.exports.index = async function (req, res) {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = function (req, res) {
    res.render("campgrounds/new");
};

module.exports.createCampground = async function (req, res, next) {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash("success", "Successfully made a new campground!");
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async function (req, res) {
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
};

module.exports.renderEditForm = async function (req, res) {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash("error", "Campground not found!");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
};

module.exports.updateCampground = async function (req, res) {
    const campground = await Campground.findByIdAndUpdate(req.params.id, {
        ...req.body.campground,
    });
    req.flash("success", "Successfully updated this campground!");
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async function (req, res) {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash("error", "Campground not found!");
        return res.redirect("/campgrounds");
    }
    await Campground.findByIdAndDelete(req.params.id);
    req.flash("success", "Successfully removed a campground!");
    res.redirect("/campgrounds");
};
