import express from "express";

let configViewEngine = (app) => {
    app.use(express.static("./uploads"));
    app.set("view engine", "ejs");
    app.set("views", "./src/views")
}

module.exports = configViewEngine;