const { getEndpoints } = require("../controllers/api.controller")
const apiRouter = require("express").Router();

apiRouter.get("/api", getEndpoints)

module.exports = apiRouter;