const { Router } = require("express");
const route = Router();

const GalleryModel = require("../models/GalleryCategory");
const ImageModel = require("../models/ImageGallery");

// Api to get all categories
route.get("/categories", async function (req, res, next) {
    try {
        const categories = await GalleryModel.find({}, { name: 1 });
        res.send(categories);
            
    } catch (error) {
        console.log(error)
        next(error);
    }
    
    
});

/** API to find images by a category */
/** API to filter image results http://localhost:3000/api/images/:categoryName?sortByDate=asc&sortByLikes=10 */

route.get("/images/:categoryName/:shuffle", async (req, res, next) => {
    try {
        const categoryName = req.params.categoryName;
        const shuffle = req.params.shuffle;

        /** get query parameters */
        const sortByDate =  req.query.sortByDate;
        const filterByLikes =  req.query.filterByLikes;

        /** send an error if category is not provided */
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
        /** setting the skip parameter to 0 or 1 using parseInt */
        let skip = parseInt(shuffle) || 0;

        /** get results by applying all the above conditions */
        const results = await ImageModel.find(
            { category: { $in: [categoryName]},
            ...filter
        }
        ).sort({createdAt: sort})
        .skip(skip)
        .limit(4);

        /** send the response as JSON */
        res.json(results);

    } catch (error) {
        console.log(err);
        next(err);
    }

});

/** API to like an image */
route.get("/like/:imageId", async(req, res, next) => {
    
    try {
        const imageId = req.params.imageId;
        /** send an error if no imageId is provided */
        if(!imageId) {
            res.status(400).send("Bad request, Please check the given parameters");
        }

        let likeValue;
        const imageFound = ImageModel.find({_id: imageId});
        
        // set the likeValue to 0 or 1
        if(imageFound) {
            if(imageFound.likes) {
                likeValue = 0;
            } else {
                likeValue = 1;
            }
        } 
        
        /** update the likes of an image, use $set method on likes field */
        await Image.updateOne( { _id: imageId }, { $set: {likes: likeValue} });

        res.send("Image has been liked once");

    } catch (error) {
        console.log(error);
        next(err);
    }
    
})

module.exports = route;
