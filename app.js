const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const _ = require("lodash");
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

// schema of a single gallery category
const galleryCategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    createdAt: String,
    updatedAt: String,
});

// schema of an image
const imageGallerySchema = new mongoose.Schema({
    name: { type: String, required: true },
    createdAt: Date,
    updatedAt: Date,
    category: [galleryCategorySchema],
    likes: Number,
    imageLink: String,
});

const ImageGallery = mongoose.model("ImageGallery", imageGallerySchema);
const GalleryCategory = mongoose.model(
    "GalleryCategory",
    galleryCategorySchema
);

const category1 = new GalleryCategory({
    name: "category-1",
});
const category2 = new GalleryCategory({
    name: "category-2",
});
const category3 = new GalleryCategory({
    name: "category-3",
});
const category4 = new GalleryCategory({
    name: "category-4",
});

defaultCategories = [category1, category2, category3, category4];

app.get("/admin", function (req, res) {
    GalleryCategory.find({}, function (err, foundCategories) {
        if (foundCategories.length === 0) {
            GalleryCategory.insertMany(defaultCategories, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Added default categories");
                }
            });
            res.send("Added default categories");
        } else {
            res.send(foundCategories);
        }
    });
});

app.post("/admin/createCategory", function (req, res) {
    const customCategory = req.body.customCategory;

    const newCategory = new GalleryCategory({
        name: customCategory,
        createdAt: new Date(),
    });
    newCategory.save();
    console.log("New category added");
    res.send("New category added");
});
