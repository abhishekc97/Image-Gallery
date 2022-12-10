const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const mongodb = require("./config/mongodb.js");

const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

const app = express();
mongodb();

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, function (req, res) {
    console.log(`Express Server has started http://${host}:${port}`);
});

app.get("/", function (req, res) {
    res.send("App started");
});

app.get("/api/health", function (req, res) {
    res.send(`Backend server is active as of time: ${new Date()}`);
});

// schema of an image
const imageSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        category: { type: Array, default: [] },
        likes: { type: Number, default: 0 },
        imageLink: { type: String },
    },
    { timestamps: true }
);

const Image = mongoose.model("Image", imageSchema);

// schema of a single gallery category
const galleryCategorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
    },
    { timestamps: true }
);

const GalleryCategory = mongoose.model(
    "GalleryCategory",
    galleryCategorySchema
);

// POST request for creating a category
app.post("/admin/addCategory", function (req, res, next) {
    const newCategory = new GalleryCategory({
        name: req.body.name,
    });
    newCategory.save(function (err, newCategory) {
        if (err) {
            console.log(err);
        } else {
            console.log(newCategory + "saved this category.");
        }
    });

    console.log("New category added");
    res.send("New category added");
});

// POST request for creating an image
app.post("/admin/addImage", function (req, res, next) {
    const newImage = new Image({
        name: req.body.name,
        category: req.body.category,
        likes: req.body.likes,
        imageLink: req.body.imageLink,
    });
    newImage.save(function (err, newImage) {
        if (err) {
            console.log(err);
        } else {
            console.log(newImage + "saved this image.");
        }
    });
    console.log("New image saved");
    res.send("Image added successfully");
});

// error handler middleware
app.use((req, res, next) => {
    const err = new Error("not found");
    err.status(404);
    next(err);
});

// express error handler, wherever next is passed, this handles those errors
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        error: { status: err.status || 500, message: err.message },
    });
});
