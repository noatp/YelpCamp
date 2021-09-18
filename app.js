const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Campground = require("./models/campground");

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

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", function (req, res) {
    res.render("home.ejs");
});

app.get("/makecampground", async function (req, res) {
    const camp = new Campground({
        title: "My Backyard",
        description: "cheap camping!",
    });
    await camp.save();
    res.send(camp);
});

app.listen(3000, function () {
    console.log("Listening on port 3000");
});
