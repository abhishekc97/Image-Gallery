const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static("public"));

try {
    mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });
    console.log("Successfully connected to MongoDB");
} catch (error) {
    console.log(err);
}
mongoose.connect(process.env["MONGO_URL"], { useNewUrlParser: true });

app.listen(port, function (req, res) {
    console.log("Express Server has started ");
});

app.get("/", function (req, res) {
    res.send("App started");
});

app.get("/api/health", function (req, res) {
    res.send("Backend server is active as of time: ");
});

const imageGallerySchema = new mongoose.Schema({
    name: { type: String, required: true },
    createdAt: Date,
    updatedAt: Date,
    category: ["category-1", "category-2", "category-3", "category-4"],
    likes: Number,
    imagelink: String,
});

const galleryCategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    createdAt: String,
    updatedAt: String,
});

const imageGallery = mongoose.model("ImageGallery", imageGallerySchema);
const galleryCategory = mongoose.model(
    "GalleryCategory",
    galleryCategorySchema
);
