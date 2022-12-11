const express = require("express");
const { forEach } = require("lodash");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const mongodb = require("./config/mongodb.js");

const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
mongodb();

app.listen(port, function (req, res) {
    console.log(`Express Server has started http://${host}:${port}`);
});

app.get("/", function (req, res) {
    res.send("App started");
});

app.get("/api/health", function (req, res) {
    res.send(`Backend server is active as of time: ${new Date()}`);
});

const admin = require("./routes/admin");
app.use("/api/admin", admin);

const discover = require("./routes/discover");
app.use("/api/discover", discover);

/** DO NOT WRITE ANY REGULAR API BELOW THIS */

// error handler middleware
app.use((req, res, next) => {
    const err = new Error("not found");
    err.status = 404;
    next(err);
});

// express error handler, wherever next is passed, this handles those errors
app.use((err, req, res, next) => {
    res.status(err.status || 500); // sets 500 if no error code is set
    res.send({
        error: { status: err.status || 500, message: err.message },
    });
});

/** DO NOT WRITE ANY API BELOW THIS */
