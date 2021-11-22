//const { createSecretKey } = require("crypto");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const campgrounds = require("./routes/campgrounds");
const reviews = require("./routes/reviews");

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
app.use(express.static("public"));

app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", reviews);

app.get("/", function (req, res) {
    res.render("home.ejs");
});

app.all("*", function (req, res, next) {
    next(new ExpressError("Page Not Found", 404));
});

app.use(function (err, req, res, next) {
    const { statusCode = 500 } = err;
    if (!err.message) {
        err.message = "Something went wrong!";
    }
    res.status(statusCode).render("error", { err });
});

app.listen(3000, function () {
    console.log("Listening on port 3000");
});
