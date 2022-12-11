const { Router } = require("express");
const route = Router();

const GalleryCategory = require("../models/GalleryCategory");
const Image = require("../models/ImageGallery");

// POST request for creating a category
route.post("/addCategory", function (req, res, next) {
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
route.post("/addImage", function (req, res, next) {
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

module.exports = route;
