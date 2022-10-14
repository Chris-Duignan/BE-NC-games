const { getCategories, postCategory } = require("../controllers/categoryControllers");
const categoryRouter = require("express").Router();

categoryRouter.route("/").get(getCategories).post(postCategory);

module.exports = categoryRouter;
