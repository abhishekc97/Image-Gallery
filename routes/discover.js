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

route.get("/images/:categoryName", async (req, res, next) => {
    try {
        const categoryName = req.params.categoryName;
        
        /** get query parameters */
        const sortByDate =  req.query.sortByDate;
        const filterByLikes =  req.query.filterByLikes;

        if(!categoryName) {
            res.status(400).send("bad request, check your sent parameters");
        }
        /** if the sort filter is given in query string*/
        let sort = 1;
        if(sortByDate) {
            if(sortByDate == "asc") {
                sort = 1;
            } else if(sortByDate == "desc") {
                sort = -1;
            }
        }
        /** if the filter by likes is given in query string */
        let filter = {};
        if(filterByLikes) {
            filter = { likes : filterByLikes};
        }
        /** get results by applying all the above conditions */
        const results = await Image.find(
            { category: { $in: [categoryName]},
            ...filter
        }
        ).sort({createdAt: sort})
        .limit(4);
        res.json(results);

    } catch (error) {
        console.log(err);
        next(err);
    }

});

module.exports = route;
