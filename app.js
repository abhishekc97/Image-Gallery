const express = require("express");
const { forEach } = require("lodash");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const mongodb = require("./config/mongodb.js");

const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
mongodb();

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
        category: [req.body.category],
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

// Api to get all categories
app.get("/discover/categories", function (req, res, next) {
    GalleryCategory.find({}, { name: 1 }, function (err, foundCategories) {
        if (err) {
            console.log(err);
            return;
        } else {
            res.send(foundCategories);
        }
    });
});

/** API to find images by a category */
app.get("/discover/images/:categoryName", function (req, res, next) {
    var categoryName = req.params.categoryName;
    const imageSet = [];
    Image.find(
        { category: categoryName },
        { name: 1, category: 1 },
        function (err, foundImages) {
            if (err) {
                console.log(err);
            }
            res.json(foundImages);
            /** important to return res to the callback here itself and not outside find function */
        }
    ).limit(4);
});

/** DO NOT WRITE ANY REGULAR API BELOW THIS */

// error handler middleware
app.use((req, res, next) => {
    const err = new Error("not found");
    err.status = 404;
    next(err);
});

// express error handler, wherever next is passed, this handles those errors
app.use((err, req, res, next) => {
    res.status(err.status || 500); // sets 500 if no error code is set
    res.send({
        error: { status: err.status || 500, message: err.message },
    });
});

/** DO NOT WRITE ANY API BELOW THIS */
