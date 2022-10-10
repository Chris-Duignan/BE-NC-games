const express = require("express");
const { getCategories } = require("./controllers/categoryControllers.js");

const app = express();

app.get("/api/categories", getCategories);

app.use(( req, res, next) => {
    res.status(404).send({
        msg: "Route not Found"
    })
})

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send({msg: "Internal Server Error"})
})

module.exports = app;
