const { Router } = require("express");
const route = Router();

const GalleryModel = require("../models/GalleryCategory");
const ImageModel = require("../models/ImageGallery");

// POST request for creating a category
route.post("/addCategory", function (req, res, next) {
    try {
        const newCategoryName = req.body.name;
        if(!newCategoryName) {
            res.status(400).send("Bad request, check given parameters");
        }
        const newCategory = {
            name: newCategoryName,
        };
        // find collection for a duplicate, do not use callback 
        const foundCategory = GalleryModel.find({name: newCategoryName});
        
        // make new category accordingly
        if(foundCategory) {
            res.status(409).send("Bad request, resource with same name already exists");
        } else {   
            GalleryModel.create(newCategory);
            res.send("New category added");
            console.log("New category added");
        }
      
    } catch (error) {
        console.log(error);
        next(error);
    }
    
});

// POST request for creating an image
route.post("/addImage", async (req, res, next) => {
    try {
        const name = req.body.name;
        const category = req.body.category;
        const imageLink = req.body.imageLink;

        if(!name || ! category || !imageLink) {
            res.status(400).send("Bad request");
        }

        const newImage = {
            name: name,
            category: category,
            imageLink: imageLink,
        };
        
        await ImageModel.create(newImage);

        console.log("New image saved");
        res.send("Image added successfully");
    
    } catch (error) {
        console.log(error);
        next(error);
    }
    
});

module.exports = route;
