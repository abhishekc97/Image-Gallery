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
/** API to filter image results http://localhost:3000/api/images/:categoryName?sortByDate=asc&sortByLikes=10 */

route.get("/images/:categoryName", function (req, res, next) {
    const categoryName = req.params.categoryName;

    /** get query parameters */
    const queryParams = req.query;
    console.log(queryParams);
    const sortByDate = queryParams.sortByDate;
    const sortByLikes = queryParams.sortByLikes;
    // let parameters = new URLSearchParams(window.location.search);

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
    // .sort(sortByDate)
    // .sort(sortByLikes);
});

/** API to shuffle the image search results */
route.get("/images/:category/:shuffle", function (req, res, next) {
    const categoryName = req.params.categoryName;
    const shuffle = req.params.shuffle;
    const imageSet = [];
});

module.exports = route;
