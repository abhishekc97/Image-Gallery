const mongoose = require("mongoose");

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

module.exports = GalleryCategory;
