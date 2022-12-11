const { Router } = require("express");
const route = Router();

const GalleryCategory = require("../models/GalleryCategory");
const Image = require("../models/ImageGallery");

// Api to get all categories
route.get("/categories", function (req, res, next) {
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
route.get("/images/:categoryName", function (req, res, next) {
    const categoryName = req.params.categoryName;
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

route.get("/images/:category:filter", function (req, res, next) {
    const category = req.params.category;
    const filter = req.params.filter;

    console.log(category + " " + filter);
});

module.exports = route;
