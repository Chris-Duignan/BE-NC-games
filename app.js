const express = require("express");
const { getCategories } = require("./controllers/categoryControllers.js");

const app = express();
app.use(express.json());

app.get("/api/categories", getCategories);

app.use(( req, res, next) => {
    res.status(404).send({
        msg: "Route not Found"
    })
})

module.exports = app;
