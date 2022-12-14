const { Router } = require("express");
const route = Router();

const GalleryCategory = require("../models/GalleryCategory");
const ImageGallery = require("../models/ImageGallery");

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
/** API to filter image results http://localhost:3000/api/discover/images/:categoryName?sortByDate=asc&sortByLikes=10 */

route.get("/images/:categoryName/:shuffle", async (req, res, next) => {
    try {
        const categoryName = req.params.categoryName;
        const shuffle = req.params.shuffle;
        /** get query parameters */
        
        const sortByDate = req.query.sortByDate;
        const filterByLikes = req.query.filterByLikes;
        let skip = parseInt(shuffle) || 0;
        if(!categoryName) {
            res.status(400).send("Bad request, check your sent parameters");
        }

        /** if the sort filter is given in request */
		let sort = 1;
        if(sortByDate) {
            if(sortByDate == "asc") {
                sort = 1;
            } else if(sortByDate == "desc") {
                sort = -1;
            }
        }
		
        /** if the filter for likes is given in request */
        let filter = { };
        if(filterByLikes) {
            filter = { likes: filterByLikes }
        }

        // await can be used only if it's inside async function
        const results = await ImageGallery.find(
            { category: { $in :[categoryName] } , 
            ...filter
        }
        ).sort( { createdAt: sort} )
        .skip(skip)
        .limit(4);

        // send the result json
		res.json(results);
		

    } catch (error) {
        console.log(error);
		next(error);
    }
    
});

module.exports = route;

