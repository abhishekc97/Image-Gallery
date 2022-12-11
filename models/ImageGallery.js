const mongoose = require("mongoose");

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

module.exports = Image;
