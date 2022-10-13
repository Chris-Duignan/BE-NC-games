const { getCategories } = require("../controllers/categoryControllers");
const categoryRouter = require("express").Router();

categoryRouter.get("/", getCategories);

module.exports = categoryRouter;
